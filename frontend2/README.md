# Frontend2 - React + Vite

This is the React + Vite version of the Indikriti admin dashboard, converted from the original Next.js application.

## Features

- **React 18** with modern hooks and patterns
- **Vite** for fast development and building
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **React Query** for data fetching and caching
- **React Hook Form** for form management
- **Zustand** for state management
- **Axios** for API calls
- **Framer Motion** for animations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # Basic UI components
│   ├── layout/         # Layout components
│   ├── products/       # Product-related components
│   ├── inventory/      # Inventory components
│   ├── pos/           # Point of Sale components
│   ├── orders/        # Order management components
│   └── finances/      # Financial components
├── context/           # React contexts
├── hooks/            # Custom hooks
├── lib/              # Utility libraries
├── pages/            # Page components
├── utils/            # Utility functions
└── assets/           # Static assets

```

## API Integration

The application connects to the backend API at `http://localhost:5000/api/v1` by default. You can change this by setting the `VITE_API_URL` environment variable.

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:5000/api/v1
```
