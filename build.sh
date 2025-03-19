#!/bin/bash
echo "Installing dependencies..."
npm install

echo "Building React app..."
CI=false npm run build

echo "Build completed successfully!" 