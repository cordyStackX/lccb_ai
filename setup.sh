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

echo "Python version:"
python3 -V

# Upgrade pip
python3 -m pip install --upgrade pip

# Install Python packages
pip install -r requirements.txt

echo "Codespace installation demo complete!"


