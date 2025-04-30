#!/bin/bash

# Function to process a directory
process_directory() {
    local dir="$1"
    echo "Processing directory: $dir"
    
    # Create compressed directory in current folder
    mkdir -p "$dir/compressed"
    
    # Process all jpg/jpeg files in current directory
    for file in "$dir"/*.jpg "$dir"/*.jpeg "$dir"/*.JPG "$dir"/*.JPEG; do
        # Check if file exists and is a regular file
        if [[ -f "$file" ]]; then
            # Get just the filename without the path
            filename=$(basename "$file")
            echo "Optimizing: $filename"
            # Convert to optimized JPEG with 85% quality
            sips -s format jpeg -s formatOptions 85 "$file" --out "$dir/compressed/${filename%.*}.jpg"
        fi
    done
    
    # Recursively process all subdirectories
    for subdir in "$dir"/*/; do
        if [[ -d "$subdir" && "$subdir" != *"/compressed/" ]]; then
            process_directory "$subdir"
        fi
    done
}

# Start processing from current directory
process_directory "."