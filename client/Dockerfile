# Use a Node base image for the React client
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# --- Docker Layer Caching Strategy: ---
# 1. Copy package files first to leverage caching for the expensive 'npm install' step.
#    This avoids reinstalling dependencies every time application source code changes.
COPY package*.json ./
# Install dependencies into the /app/node_modules directory
RUN npm install

# 2. Copy all remaining source code (App.jsx, index.html, etc.)
COPY . .