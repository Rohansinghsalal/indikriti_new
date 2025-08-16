#!/bin/bash

# Frontend2 Development Setup Script
echo "🛠️  Setting up development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies!"
    exit 1
fi

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📄 Creating .env file from .env.example..."
    cp .env.example .env
fi

echo "🎉 Development environment setup complete!"
echo ""
echo "Available commands:"
echo "  npm run dev     - Start development server"
echo "  npm run build   - Build for production"
echo "  npm run preview - Preview production build"
echo "  npm run lint    - Run ESLint"
echo ""
echo "To start developing:"
echo "  npm run dev"
