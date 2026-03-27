#!/bin/bash
echo "Building LGT Games Portal for short URLs..."
mkdir -p dist

# Copy portal root files
cp index.html style.css dist/

# Copy structural logic directories
cp -r shared data js dist/

# Extract all games from the game/ folder directly into the root of dist
cp -r game/* dist/

echo "Build complete."
