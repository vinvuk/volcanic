# Volcanic

Real-time 3D visualization of volcanic activity worldwide.

**[viewvolcano.com](https://viewvolcano.com)**

## Features

- **Interactive 3D Globe** - Explore Earth with high-resolution day/night textures and cloud layers
- **1,400+ Volcanoes** - Comprehensive database sourced from the Smithsonian Global Volcanism Program
- **Real-time Status** - Track erupting, warning, watch, advisory, and normal volcanoes
- **Filter & Search** - Find volcanoes by name or filter by activity level
- **Responsive Design** - Works on desktop and mobile devices
- **PWA Support** - Install as an app on your device

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **3D Rendering**: [Three.js](https://threejs.org/) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/vinvuk/volcanic.git
cd volcanic

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

No environment variables are required for basic functionality.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes for volcano data
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Main page component
├── components/
│   ├── Earth.tsx          # 3D Earth globe
│   ├── Scene.tsx          # Three.js scene setup
│   ├── VolcanoMarkers.tsx # Volcano point markers
│   └── v3/                # UI components (glass morphism)
├── hooks/                 # Custom React hooks
└── lib/                   # Types and utilities
```

## Data Sources

- **Volcano Database**: [Smithsonian Global Volcanism Program](https://volcano.si.edu/)
- **Earth Textures**: [Solar System Scope](https://www.solarsystemscope.com/textures/) (CC BY 4.0)

## License

This project is for educational and informational purposes.

Earth textures are used under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).

## Disclaimer

This application is **NOT intended for emergency use or safety decisions**. Volcano status information may be delayed, incomplete, or inaccurate. Always refer to official sources such as local geological surveys, USGS, or emergency services for safety-critical information.
