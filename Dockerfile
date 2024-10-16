# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Create a user with permissions to run the app
RUN addgroup app && adduser -S -G app app

# Set the user to run the app, ensuring non-root execution for security
USER app

# Set the working directory to /app
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the working directory
# This step leverages Docker's caching to avoid unnecessary reinstallation of dependencies
COPY package.json pnpm-lock.yaml ./

# Copy the database file to the working directory
COPY ./src/db/league.db /app/dev.db

# Change to root to modify permissions, ensuring all files are writable
USER root

# Ensure write permissions for the app directory and its contents
RUN chmod -R u+w .

# Change the ownership of the /app directory to the app user
RUN chown -R app:app .

# Change the ownership of dev.db to the app user
RUN chown app:app dev.db

RUN npm install -g pnpm
# Switch back to the non-root app user
USER app

# Install pnpm globally since we are using it for dependency management

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 3000, assuming your app runs on this port
EXPOSE 3000

# Command to run the app
CMD ["npm", "run", "dev"]
