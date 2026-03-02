#!/bin/bash

# Start JadeAI application
echo "Starting JadeAI application..."

# Check if already running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "Application is already running on port 3000"
    exit 1
fi

# Start the dev server
npm run dev &

# Wait for server to be ready
echo "Waiting for server to start..."
for i in {1..30}; do
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
        echo "✓ Application started successfully on http://localhost:3000"
        exit 0
    fi
    sleep 1
done

echo "✗ Failed to start application (timeout)"
exit 1
