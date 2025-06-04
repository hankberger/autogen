#!/bin/sh

# Start the backend server in the background
echo "Starting backend server..."
node /app/server/server.js &

# Start NGINX in the foreground
echo "Starting NGINX..."
nginx -g 'daemon off;'
