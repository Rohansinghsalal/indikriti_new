# Admin Panel Frontend

This is the frontend for the Admin Panel application, built with Next.js, React, and Tailwind CSS.

## Features

- Modern UI with responsive design
- Authentication system (mocked for development)
- Dashboard with analytics
- User management
- Product management
- Order management
- And more...

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Mock API

The frontend currently uses mock data for development. The mock API is implemented in `src/utils/api.ts`. 

To use the mock API, make sure the `USE_MOCK_DATA` flag is set to `true` in `src/utils/api.ts`. This allows you to develop the frontend without requiring the backend to be running.

## Development Notes

### Authentication

- The application uses a mock authentication system for development.
- Login is automatically performed with admin credentials.
- Credentials: Email: `admin@example.com`, Password: `admin123` (not actually validated in mock mode)

### Project Structure

- `src/app` - Next.js App Router pages
- `src/components` - Reusable React components
- `src/context` - React context providers
- `src/hooks` - Custom React hooks
- `src/utils` - Utility functions

### Routing

The application uses Next.js App Router for routing. The main routes are:

- `/` - Redirects to `/dashboard`
- `/login` - Login page
- `/dashboard` - Main dashboard
- `/dashboard/products` - Product management
- `/dashboard/orders` - Order management
- `/dashboard/users` - User management
- `/dashboard/settings` - Settings page

## Building for Production

```bash
npm run build
# or
yarn build
```

## License

This project is licensed under the MIT License.
