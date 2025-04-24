#!/bin/bash

# This script can be used to trigger a Netlify build through their build hooks
# Replace BUILD_HOOK_URL with your actual Netlify build hook URL
# Run this script when you want to trigger a manual build/deployment

BUILD_HOOK_URL="https://api.netlify.com/build_hooks/YOUR_BUILD_HOOK_ID"

echo "Triggering Netlify build..."
curl -X POST -d {} $BUILD_HOOK_URL

echo "Build triggered! Check your Netlify dashboard for progress."