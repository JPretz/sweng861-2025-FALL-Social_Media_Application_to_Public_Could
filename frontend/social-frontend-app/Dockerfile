# Stage 1: Build the React app
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy React build to nginx html folder
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx.conf from the frontend root folder
COPY ../nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port Cloud Run expects
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

