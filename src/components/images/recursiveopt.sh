#!/bin/bash

# Exit on any error
set -e

# Source and destination root directories
SOURCE_DIR="."
DEST_DIR="../images-compressed"

# Check if required tools are installed
for cmd in pngquant magick identify bc; do
    if ! command -v $cmd &> /dev/null; then
        echo "Error: $cmd is not installed. Please install it first."
        echo "You can use: brew install pngquant imagemagick bc"
        exit 1
    fi
done

# Function to process a directory
process_directory() {
    local source_dir="$1"
    local rel_path="$2"
    local dest_dir="${DEST_DIR}/${rel_path}"
    
    echo "Processing directory: $source_dir"
    
    # Create destination directory
    mkdir -p "$dest_dir"
    
    # Process all image files in current directory
    for file in "$source_dir"/*.{jpg,jpeg,JPG,JPEG,png,PNG}; do
        # Skip if the pattern doesn't match any files
        [ -e "$file" ] || continue
        
        # Check if file exists and is a regular file
        if [[ -f "$file" ]]; then
            # Get just the filename without the path and extension
            filename=$(basename "$file")
            extension="${filename##*.}"
            extension_lower=$(echo "$extension" | tr '[:upper:]' '[:lower:]')
            
            # Get image dimensions
            dimensions=$(identify -format "%wx%h" "$file" 2>/dev/null || echo "unknown")
            echo "Optimizing: $rel_path/$filename ($dimensions)"

            output_file="$dest_dir/${filename%.*}"
            
            # Handle different image types with better color preservation
            if [[ "$extension_lower" == "png" ]]; then
                # More conservative PNG settings that preserve colors better
                pngquant --quality=60-80 --force --output "${output_file}.png" "$file"
                
                # Fallback if pngquant fails
                if [ ! -f "${output_file}.png" ]; then
                    magick "$file" -strip -quality 70 "${output_file}.png"
                fi
            else
                # Better color preservation for JPEGs
                magick "$file" -strip -quality 65 -colorspace sRGB -interlace Plane "${output_file}.jpg"
            fi
            
            # Compare file sizes
            if original_size=$(stat -f %z "$file" 2>/dev/null); then
                new_file="${output_file}"
                if [[ "$extension_lower" == "png" ]]; then
                    new_file="${new_file}.png"
                else
                    new_file="${new_file}.jpg"
                fi
                
                if compressed_size=$(stat -f %z "$new_file" 2>/dev/null); then
                    # Format sizes nicely
                    original_kb=$(echo "scale=2; $original_size/1024" | bc)
                    compressed_kb=$(echo "scale=2; $compressed_size/1024" | bc)
                    
                    echo "Original size: ${original_kb}KB"
                    echo "Compressed size: ${compressed_kb}KB"
                    
                    # Only keep the compressed file if it's actually smaller
                    if [ $compressed_size -ge $original_size ]; then
                        echo "Compressed version is not smaller - using original"
                        rm "$new_file"
                        cp "$file" "$new_file"
                        echo "Copied original file"
                    else
                        # Calculate and show percentage saved
                        saving=$(echo "scale=2; ($original_size - $compressed_size) * 100 / $original_size" | bc)
                        echo "Space saved: ${saving}%"
                    fi
                else
                    echo "Warning: Could not read compressed file size for $filename"
                fi
            else
                echo "Warning: Could not read original file size for $filename"
            fi
            
            echo "----------------------------------------"
        fi
    done
    
    # Copy non-image files to maintain directory structure
    for file in "$source_dir"/*; do
        # Skip if the pattern doesn't match any files
        [ -e "$file" ] || continue
        
        # Only process regular files that aren't images
        if [[ -f "$file" ]]; then
            filename=$(basename "$file")
            extension="${filename##*.}"
            extension_lower=$(echo "$extension" | tr '[:upper:]' '[:lower:]')
            
            # Skip image files as we've already processed them
            if [[ "$extension_lower" != "jpg" && "$extension_lower" != "jpeg" && "$extension_lower" != "png" ]]; then
                cp "$file" "$dest_dir/$filename"
            fi
        fi
    done
    
    # Recursively process all subdirectories
    for subdir in "$source_dir"/*/; do
        # Skip if the pattern doesn't match any directories
        [ -e "$subdir" ] || continue
        
        if [[ -d "$subdir" ]]; then
            subdir_name=$(basename "$subdir")
            # Skip the destination directory if it's a subdirectory of source
            if [[ "$subdir" != *"$DEST_DIR"* ]]; then
                new_rel_path="${rel_path}/${subdir_name}"
                # Remove leading slash if present
                new_rel_path="${new_rel_path#/}"
                process_directory "$subdir" "$new_rel_path"
            fi
        fi
    done
}

# Create the destination root directory
mkdir -p "$DEST_DIR"

# Start processing from current directory with empty relative path
process_directory "$SOURCE_DIR" ""

echo "Compression complete. Compressed images are in: $DEST_DIR"