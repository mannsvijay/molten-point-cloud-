# Chromatic Flux — The Molten Point Cloud

Chromatic Flux is an immersive, experimental web experience built with Next.js and React Three Fiber. It presents a cinematic landing experience that blends liquid chrome, volatile particle motion, and interactive UI into a single atmospheric scene.

The project is designed as a visually rich, high-impact front-end experience for an event or concept launch, with animated typography, a custom 3D scene, scroll-driven transitions, and a polished glassmorphism-inspired interface.

## Overview

This project brings together:

- A full-screen 3D canvas powered by Three.js and React Three Fiber
- A particle-based visual effect that evolves as the user scrolls or moves the cursor
- Animated UI layers with Framer Motion
- A modern Next.js application structure with Tailwind CSS styling
- A Zustand store for managing scroll and interaction-driven state

The experience is intentionally stylized and abstract, with a molten, chromatic aesthetic inspired by liquid metal, flux, and point-cloud transformations.

## Features

- Immersive 3D environment with lighting, reflections, and post-processing
- Scroll-driven transition from liquid-like motion to point-cloud dissolution
- Interactive navigation with magnetic hover effects
- Animated hero typography and call-to-action elements
- Responsive layout for desktop and mobile screens
- Lightweight state management using Zustand

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- React Three Fiber
- React Three Drei
- React Three Rapier
- Three.js
- Framer Motion
- Zustand
- Lucide React

## Project Structure

- app/ - Next.js app router pages and global layout
- components/ - UI and 3D scene components
  - canvas/ - Three.js scene, particles, shaders, and post-processing
  - ui/ - Overlay, hero text, navigation, and CTA buttons
- lib/ - Utility helpers
- store/ - Zustand state management

## Getting Started

### Prerequisites

- Node.js 18.18 or newer
- npm or pnpm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Run locally

Start the development server:

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## Available Scripts

- npm run dev - start the local development server
- npm run build - create a production build
- npm run start - run the production build locally
- npm run lint - run Next.js lint checks

## How It Works

The experience begins with an atmospheric 3D scene and a layered UI overlay. As the user interacts with the page, the state store updates values such as scroll progress, pointer velocity, and fracture dissolve. These values drive visual changes in the scene, including:

- The transition between liquid and particle forms
- Distortion and chromatic effects
- The dissolution of the cloud-like structure over time

The overall effect is intended to feel like a cinematic transition from matter to energy.

## Customization

You can customize the experience by editing:

- The hero copy and UI text in the components under components/ui/
- The 3D scene and shaders in components/canvas/
- The color palette and styling in app/globals.css and Tailwind configuration
- The state logic in store/useStore.ts

## License

This project is for demo and creative development purposes.
