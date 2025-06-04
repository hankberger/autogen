# Use node:18-alpine as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
# Use package-lock.json for npm to ensure deterministic installs
COPY package.json package-lock.json* ./
# If you use yarn, replace the line above with:
# COPY package.json yarn.lock ./

# Install production dependencies
# Using --only=production to avoid installing devDependencies
RUN npm install --only=production
# If you use yarn, replace the line above with:
# RUN yarn install --production

# Copy the rest of the application source code
COPY . .

# Expose the port the app runs on
# Replace 3000 with your application's actual port if different
EXPOSE 3000

# Define the command to run the application
# This usually comes from the "scripts.start" in package.json
# Or you can directly specify the entry point like "node server.js"
CMD ["npm", "start"]
