#!/bin/bash

# React App Startup Script
APP_DIR="/opt/jagedo"
LOG_FILE="/var/log/react-app.log"

echo "$(date): Starting React application..." >> "$LOG_FILE"

# Navigate to app directory
cd "$APP_DIR" || { echo "Failed to change directory to $APP_DIR" >> "$LOG_FILE"; exit 1; }

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "$(date): Installing dependencies..." >> "$LOG_FILE"
    npm i --force >> "$LOG_FILE" 2>&1
    if [ $? -ne 0 ]; then
        echo "$(date): Failed to install dependencies" >> "$LOG_FILE"
        exit 1
    fi
fi

# Start the development server
echo "$(date): Starting React development server..." >> "$LOG_FILE"
npm run dev >> "$LOG_FILE" 2>&1
