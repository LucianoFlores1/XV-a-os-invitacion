#!/usr/bin/env python3
"""
Re-tiñe la plantilla a un color de acento nuevo.

Busca cada color de la familia del acento actual (por defecto el azul Francia #1d44c4) en el
código, los SVG y el generador de texturas, y lo rota al tono nuevo conservando luminosidad
la relación de saturación, y lleva la luminosidad de los tonos medios hacia la del acento nuevo. Los neutros (blancos, grises) y los colores semánticos de otras
familias (el rojo del "no" del dress code, los pasteles del holográfico) no se tocan.

Uso:
  python3 cambiar-paleta.py <carpeta-del-proyecto> <hex-acento-nuevo> [--base #1d44c4] [--rango 45]

Ejemplos:
  python3 cambiar-paleta.py ./mi-invitacion "#c2185b"   # rosa
  python3 cambiar-paleta.py ./mi-invitacion "#2e7d5b"   # verde esmeralda

Después:
  node scripts/generar-texturas.cjs   # regenera satén y glitter con los tonos nuevos
  npm run build
"""
import argparse
import colorsys
import pathlib
import re
import sys

EXTS = {'.css', '.jsx', '.js', '.svg', '.html', '.cjs'}


def hex_to_rgb(h):
    h = h.lstrip('#')
    if len(h) == 3:
        h = ''.join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def hls(rgb):
    return colorsys.rgb_to_hls(*(c / 255 for c in rgb))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('proyecto')
    ap.add_argument('acento')
    ap.add_argument('--base', default='#1d44c4', help='acento actual de la plantilla')
    ap.add_argument('--rango', type=float, default=45, help='grados de tono alrededor del acento base que se consideran de su familia')
    a = ap.parse_args()

    bh, bl, bs = hls(hex_to_rgb(a.base))
    th, tl, ts = hls(hex_to_rgb(a.acento))
    sat_k = ts / bs if bs else 1

    def convertir(rgb):
        h, l, s = hls(rgb)
        dist = min(abs(h - bh), 1 - abs(h - bh)) * 360
        if s < 0.12 or dist > a.rango:
            return None
        nh = (th + (h - bh)) % 1
        ns = max(0, min(1, s * sat_k))
        # la luminosidad se corre hacia la del acento nuevo en los tonos medios;
        # los muy claros (fondos) y muy oscuros (tinta) casi no cambian
        peso = max(0.0, 1 - abs(l - bl) / 0.5)
        nl = max(0, min(1, l + (tl - bl) * peso))
        r, g, b = colorsys.hls_to_rgb(nh, nl, ns)
        return tuple(round(c * 255) for c in (r, g, b))

    cambios = 0

    def sub_hex(m):
        nonlocal cambios
        pre, h = m.group(1), m.group(2)
        n = convertir(hex_to_rgb(h))
        if not n:
            return m.group(0)
        cambios += 1
        return pre + '{:02x}{:02x}{:02x}'.format(*n)

    def sub_rgb(m):  # rgb(29 68 196 / .5) o rgb(29_68_196/0.5) de Tailwind
        nonlocal cambios
        r, s1, g, s2, b = m.group(1), m.group(2), m.group(3), m.group(4), m.group(5)
        n = convertir((int(r), int(g), int(b)))
        if not n:
            return m.group(0)
        cambios += 1
        return f'rgb({n[0]}{s1}{n[1]}{s2}{n[2]}'

    def sub_trio(m):  # '29,68,196' (glitter) o [29, 68, 196] (tonos del satén)
        nonlocal cambios
        r, g, b = int(m.group(2)), int(m.group(4)), int(m.group(6))
        # tríos chicos como [0, 1, 2] son índices de código, no colores
        if max(r, g, b) < 24:
            return m.group(0)
        n = convertir((r, g, b))
        if not n:
            return m.group(0)
        cambios += 1
        return f'{m.group(1)}{n[0]}{m.group(3)}{n[1]}{m.group(5)}{n[2]}{m.group(7)}'

    raiz = pathlib.Path(a.proyecto)
    archivos = [p for p in list((raiz / 'src').rglob('*')) + list((raiz / 'scripts').glob('*')) + [raiz / 'index.html'] if p.is_file() and p.suffix in EXTS]
    for p in archivos:
        s = p.read_text(encoding='utf-8')
        o = s
        s = re.sub(r'(#|%23)([0-9a-fA-F]{6})\b', sub_hex, s)
        s = re.sub(r'rgb\((\d{1,3})([ _])(\d{1,3})([ _])(\d{1,3})', sub_rgb, s)
        s = re.sub(r"(')(\d{1,3})(,)(\d{1,3})(,)(\d{1,3})(')", sub_trio, s)
        s = re.sub(r'(\[)(\d{1,3})(, )(\d{1,3})(, )(\d{1,3})(\])', sub_trio, s)
        if s != o:
            p.write_text(s, encoding='utf-8')
            print('  ', p.relative_to(raiz))
    print(f'{cambios} colores re-teñidos hacia {a.acento}.')
    print('Ahora: node scripts/generar-texturas.cjs && npm run build')


if __name__ == '__main__':
    sys.exit(main())
