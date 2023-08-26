# Use the official Node.js 14.20.0 image from the Docker Hub as the base image.
# This image includes Node.js and npm, which are needed to build the application.
FROM node:16.14.0 as builder

# The ARG instruction defines a variable that users can pass at build-time to the builder with the docker build command.
# Here ENVIRONMENT is a variable that will be used later in the ng build command.
ARG ENVIRONMENT

# Set the CHROME_BIN environment variable to 'chromium'.
# This variable is used by some packages like Puppeteer (a headless browser) to know where the Chromium binary is located.
ENV CHROME_BIN=chromium

# Set the working directory in the Docker image to /app.
# All the following instructions (RUN, CMD, ENTRYPOINT, COPY, and ADD) will be run/executed in this directory.
WORKDIR /app

# Add the Debian Stretch repositories to the sources.list file and update the package lists for upgrades for packages that need upgrading,
# as well as new packages that have just been released. Then install Chromium.
RUN echo "deb http://archive.debian.org/debian/ stretch main" > /etc/apt/sources.list \
    && echo "deb-src http://archive.debian.org/debian/ stretch main" >> /etc/apt/sources.list \
    && apt-get update && apt-get install -y chromium

# Copy package-lock.json and package.json from your host to the present location (.) in your image (which is /app as defined by WORKDIR).
COPY package-lock.json package.json ./

# Install all the dependencies of the app and also install @angular/cli globally.
RUN npm i && npm i -g @angular/cli

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .


# Build the application using the Angular CLI (ng) build command.
# The configuration used (dev, prod) will be the one passed as ENVIRONMENT when building the Docker image.
RUN ng build -c $ENVIRONMENT

# Use a lightweight version of the official Nginx image as a base image for the final stage.
FROM nginx:alpine

# Remove the default Nginx website.
RUN rm -rf /usr/share/nginx/html/*

# Copy the built app to the Nginx server.
# We only copy the built app from the previous stage, which results in a smaller final image.
COPY --from=builder /app/dist /usr/share/nginx/html

# Inform Docker that the container listens on the specified network ports at runtime.
# Here it's port 80, the standard port for HTTP.
EXPOSE 80

# The CMD instruction provides defaults for an executing container.
# These defaults can include an executable, or they can omit the executable, in which case you must specify an ENTRYPOINT instruction.
# Here it runs Nginx and ensures Nginx stays in the foreground so Docker can track the process properly (instead of Nginx going into the background).
CMD ["nginx", "-g", "daemon off;"]
