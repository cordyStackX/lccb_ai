#!/bin/bash

# setup.sh - Automation for Codespace installations demo

set -e

echo "Starting Codespace installation demo..."

# Update package lists
sudo apt-get update

# Install essential packages
sudo apt-get install -y npm nodejs python3 python3-pip

echo "Node.js version:"
node -v
npm -v
npx -v

echo "Installing NPM packages..."
npm install

echo "Python version:"
python3 -V

# Upgrade pip
python3 -m pip install --upgrade pip

# Install Python packages
pip install -r requirements.txt

echo "

Codespace installation demo complete!

"

echo "

Running npm run build

"
npm run build

echo "Starting API server..."
nohup python3 /src/app/python/api_server.py &

echo "Starting Nextjs at http://localhost:3000"
npm run start

# Keep the script running to maintain the Codespace environment