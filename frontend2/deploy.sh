#!/bin/bash

# Frontend2 Deployment Script
echo "🚀 Starting deployment process..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build files are in the 'dist' directory"
    
    # Optional: Copy to deployment directory
    # cp -r dist/* /path/to/deployment/directory/
    
    echo "🎉 Deployment ready!"
else
    echo "❌ Build failed!"
    exit 1
fi
