# Invitación web

Invitación interactiva hecha con Vite + React + Tailwind v4 + Motion.

## Editar
Todo lo del evento está en `src/config.js`: datos, textos, dress code, música, playlist y alias.

## Cambiar el color
```bash
python3 <skill>/scripts/cambiar-paleta.py . "#c2185b"
node scripts/generar-texturas.cjs
```

## Correr
```bash
npm install
npm run dev
```

## Publicar
Push a `main` publica en GitHub Pages con `.github/workflows/deploy.yml` (activar Settings → Pages → Source: GitHub Actions una vez). También se puede subir `dist/` a Netlify o Vercel.
