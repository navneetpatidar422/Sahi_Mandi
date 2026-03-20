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
  App.tsx               - Root application component
  main.tsx              - React entry point
  index.css             - Global styles (Tailwind)
  assets/               - Static image assets (Figma exports)
  components/           - Reusable UI components
  pages/
    Home.tsx            - Landing page
    MandiDiscovery.tsx  - Browse & filter mandis
    MandiMap.tsx        - Interactive map of all mandis with geolocation
    MandiDetails.tsx    - Single mandi detail view
    SmartAnalyzer.tsx   - Price analysis tool
    Chat.tsx            - Chat interface
    Admin.tsx           - Admin panel
    FarmerDashboard.tsx - Logged-in farmer dashboard
    PlatformDocs.tsx    - Documentation
  lib/
    mockData.ts          - All mandi, crop, price data
    mandiCoordinates.ts  - Lat/lng for each mandi on the map
  styles/               - Additional style files
public/            - Public static assets
build/             - Vite build output (outDir)
```

## Map Feature

- Interactive map powered by **Leaflet** + **React-Leaflet v4** (OpenStreetMap, no API key needed)
- Shows all 50 mandis as green markers across India
- "Locate Me" button uses browser geolocation to detect user's location
- After location is found: blue marker shows the user, a 50km radius circle appears, and a ranked "Nearest Mandis" sidebar lists the 5 closest mandis by real distance
- Clicking any mandi marker or sidebar item shows a popup and flies the map to that location
- Clicking "View Details" navigates directly to that mandi's detail page

## Development

- **Dev server**: `npm run dev` — runs on port 5000 (0.0.0.0)
- **Build**: `npm run build` — outputs to `build/` directory

## Deployment

Configured as a **static** deployment:
- Build command: `npm run build`
- Public directory: `build`
