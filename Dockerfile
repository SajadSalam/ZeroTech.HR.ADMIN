# Stage 1: Build the Nuxt application
FROM node:20-alpine AS build

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY pnpm-lock.yaml ./
COPY package.json ./

# Install dependencies using pnpm
RUN pnpm install

# Copy application files
COPY . .

# Build the application
RUN pnpm run generate


# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

# Install tzdata for timezones
RUN apk add --no-cache tzdata

# Set timezone to Baghdad
ENV TZ=Asia/Baghdad

# Copy built files from the build stage
COPY --from=build /app/.output/public /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
