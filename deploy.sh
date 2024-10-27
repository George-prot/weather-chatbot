#!/bin/bash

echo "Deploying application..."

# Pull the latest code from the main branch (requires a Git remote)
git pull origin main

# Run setup script to install dependencies
./setup.sh

# Run the chatbot script
./run.sh $1

echo "Deployment complete."
