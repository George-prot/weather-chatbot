#!/bin/bash

# Check if environment variables are set
if [ ! -f "openweatherApiKey.env" ]; then
    echo "Error: .env file not found. Please create it and add the API key."
    exit 1
fi

# Run the chatbot
if [ -f "index.js" ]; then
    node index.js $1
elif [ -f "bot.py" ]; then
    python bot.py
fi
