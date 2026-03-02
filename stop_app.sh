#!/bin/bash

# Stop JadeAI application
echo "Stopping JadeAI application..."

# Find and kill process on port 3000
PID=$(lsof -ti :3000)

if [ -z "$PID" ]; then
    echo "No application running on port 3000"
    exit 0
fi

echo "Killing process $PID..."
kill $PID

# Wait for process to terminate
for i in {1..10}; do
    if ! lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
        echo "✓ Application stopped successfully"
        exit 0
    fi
    sleep 1
done

# Force kill if still running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "Force killing process..."
    kill -9 $PID
    sleep 1
fi

echo "✓ Application stopped"
