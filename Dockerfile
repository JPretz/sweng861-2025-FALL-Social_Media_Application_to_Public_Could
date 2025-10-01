# Use Node.js as base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port and start app
EXPOSE 3000
CMD ["npm", "start"]
