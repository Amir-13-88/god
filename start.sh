#!/bin/bash

echo ""
echo "========================================"
echo "  Leitner Language App - Starting..."
echo "========================================"
echo ""
echo "Please wait..."
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo ""
    echo "Please install Node.js first:"
    echo "https://nodejs.org"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    echo "This may take 1-2 minutes..."
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo ""
        echo "ERROR: Installation failed!"
        read -p "Press Enter to exit..."
        exit 1
    fi
    echo ""
    echo "Installation complete!"
    echo ""
fi

# Build the project
echo "Building the app..."
npm run build
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Build failed!"
    read -p "Press Enter to exit..."
    exit 1
fi

echo ""
echo "Starting local server..."
echo ""
echo "========================================"
echo "  App is running!"
echo "  Opening browser..."
echo "========================================"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Open browser
(sleep 2 && open http://localhost:4173) &

# Start preview server
npm run preview
