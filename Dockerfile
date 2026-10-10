# Use official Node.js image as the base
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application to container
COPY . .

# Build the React/Vite application
RUN npm run build

# Install serve to serve the production build
RUN npm install -g serve

# Expose the port your app runs on
EXPOSE 4173

# Command to run your application
CMD ["serve", "-s", "server/build", "-l", "4173"]
