# Stage 1: Build the frontend
FROM node:18-alpine AS builder
WORKDIR /app

# Copy necessary files for frontend build
COPY package.json package-lock.json ./
COPY vite.config.ts vite.config.ts
COPY tsconfig.json tsconfig.json
COPY tsconfig.app.json tsconfig.app.json
COPY tsconfig.node.json tsconfig.node.json
COPY index.html index.html
COPY public ./public
COPY src ./src

# Install frontend dependencies
RUN npm install

# Build the frontend application
RUN npm run build

# Stage 2: Setup backend
FROM node:18-alpine AS backend-setup
WORKDIR /app/server

# Copy backend package files and install dependencies
COPY server/package.json server/package-lock.json ./
RUN npm install

# Copy the rest of the backend application files
COPY server/server.js server/server.js
COPY server/database.js server/database.js
COPY server/blog.db server/blog.db # Important: Copy the database file

# Stage 3: Production image
FROM nginx:stable-alpine
WORKDIR /app

# Copy NGINX configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built frontend from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy backend files from the backend-setup stage
COPY --from=backend-setup /app/server ./server

# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port 80 for NGINX
EXPOSE 80

# Run the entrypoint script
CMD ["/entrypoint.sh"]
