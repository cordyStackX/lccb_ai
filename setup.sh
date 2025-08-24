#!/bin/bash
set -e

echo "Starting installation..."

# Update package lists
sudo apt-get update

# Install essential packages (optional if already present in Codespaces)
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

echo "Building Next.js app..."
npm run build

# Start FastAPI in background
echo "Starting FastAPI server..."
nohup python3 src/python/api_server.py > fastapi.log 2>&1 &

# Start Next.js server (this will block)
echo "Starting Next.js at http://localhost:3000"
npm run start
