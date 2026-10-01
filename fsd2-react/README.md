# FSD2 React Full Conversion

This folder is a converted React app that includes the original HTML pages and legacy `script.js` for reference.

To prepare assets (copy images and original `script.js`/`style.css` from repo root):

```bash
cd fsd2-react
node prepare-assets.js
```

Then install and run:

```bash
npm install
npm run dev
```

Notes:
- The legacy `script.js` will be copied to `fsd2-react/public/script.js` by `prepare-assets.js` when available.
- If you want, I can migrate all logic from `script.js` into React hooks and components; tell me to proceed.
