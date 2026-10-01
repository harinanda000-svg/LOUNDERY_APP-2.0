# FSD React Conversion

This folder contains a Vite + React conversion of the original static app.

Quick start:

1. From this repo root run:

```bash
cd fsd-react
npm install
npm run dev
```

2. The original Express server (for `/login`) is in the repo root — run it if you need server auth:

```bash
node server.js
```

Notes:
- The app uses the same localStorage logic as the original pages for signup and bookings.
- Static assets (logo, hero images) were referenced from the repo root; copy them into `fsd-react/public` if desired.
