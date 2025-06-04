# Stage 1: Build the frontend application
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json package-lock.json* ./
# If you use yarn, replace the line above with:
# COPY package.json yarn.lock ./

# Install dependencies
RUN npm install
# If you use yarn, replace the line above with:
# RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build
# If you use yarn, replace the line above with:
# RUN yarn build

# Stage 2: Serve the frontend application with Nginx
FROM nginx:stable-alpine

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
# If your build output directory is different (e.g., /app/build), adjust the line above accordingly

# Expose port 80
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
