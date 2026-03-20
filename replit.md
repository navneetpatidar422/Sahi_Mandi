# Sahi Mandi

A React + Vite frontend application — an online marketplace/shopping platform.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6 (with @vitejs/plugin-react-swc)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives, shadcn/ui patterns
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animation**: Framer Motion
- **Form handling**: React Hook Form
- **Package manager**: npm

## Project Structure

```
src/
  App.tsx          - Root application component
  main.tsx         - React entry point
  index.css        - Global styles (Tailwind)
  assets/          - Static image assets (Figma exports)
  components/      - Reusable UI components
  pages/           - Page-level components
  lib/             - Utility functions
  styles/          - Additional style files
public/            - Public static assets
build/             - Vite build output (outDir)
```

## Development

- **Dev server**: `npm run dev` — runs on port 5000 (0.0.0.0)
- **Build**: `npm run build` — outputs to `build/` directory

## Deployment

Configured as a **static** deployment:
- Build command: `npm run build`
- Public directory: `build`
