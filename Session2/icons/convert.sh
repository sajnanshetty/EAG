#!/bin/bash

# Install ImageMagick if not already installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is required but not installed. Please install it first."
    echo "On macOS, you can install it using: brew install imagemagick"
    exit 1
fi

# Convert SVG to different PNG sizes
convert -background none -size 16x16 icon.svg icon16.png
convert -background none -size 48x48 icon.svg icon48.png
convert -background none -size 128x128 icon.svg icon128.png

echo "Icons generated successfully!" 