# Dockerfile with instructions for the docker

FROM node:16.17.0-alpine as build

LABEL maintainer="Rachit Chawla <rachitchawla33@gmail.com>"
LABEL description="Fragments microservice UI"

# We default to use port 8080 in our service
ENV PORT=80

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

#Copy the package.json and package-lock.json
COPY package*.json /app/

# Install node dependencies defined in package-lock.json
RUN npm install

# Copy src to /app/src/
COPY ./src ./src

RUN npm run build

FROM nginx:1.15 as production

# Setting working directory to app
WORKDIR /app

COPY --from=build /app/dist/ /usr/share/nginx/html

# Set NODE_ENV to production
ENV NODE_ENV=production

# We run our service on port 8080
EXPOSE 80
