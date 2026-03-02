#!/bin/bash

# Restart JadeAI application
echo "Restarting JadeAI application..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Stop the application
"$SCRIPT_DIR/stop_app.sh"

# Wait a moment
sleep 2

# Start the application
"$SCRIPT_DIR/start_app.sh"
