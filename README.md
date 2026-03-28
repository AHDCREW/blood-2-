# Blood Donation & SOS (React + Vite)

## Progressive Web App (PWA)

The app is built with [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) (Workbox): installable on supported browsers, with static assets precached and API / map tiles using the network only.

**Verify after a production build**

1. `npm run build` then `npm run preview` (serves `dist/` over HTTP; use `preview --host` for LAN).
2. Open the preview URL in Chrome or Edge. In DevTools → Application → Manifest / Service Workers, confirm the manifest and `sw.js` are registered.
3. Use the browser “Install app” / “Add to Home Screen” when offered (HTTPS or `localhost` required for install).
4. Confirm API calls still reach your backend: set `VITE_API_URL` before `npm run build` to your public API base URL (e.g. `https://api.example.com`). The service worker does not cache `/api/` responses.

**PWA-like UI (safe areas)**

The layout uses `viewport-fit=cover` and CSS `env(safe-area-inset-*)` so header, footer, and the floating SOS button clear notches and the home indicator on iPhones and similar devices. After **Add to Home Screen**, open the app from the icon (standalone mode) and confirm content is not obscured at the top or bottom.

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
