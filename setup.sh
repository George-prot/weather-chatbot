#!/bin/bash

echo "Setting up environment..."

# Check if Node.js or Python is installed, install dependencies
if [ -f "package.json" ]; then
    npm install
elif [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
fi

echo "Environment setup complete."
