# Syukur Bin Md Kassim

### STAGE 1: Build ###

# We label our stage as ‘builder’
FROM node:18-alpine as builder


## Storing node modules on a separate layer will prevent unnecessary npm installs at each build

#COPY package.json package-lock.json ./
#RUN npm ci && mkdir /ng-app && mv ./node_modules ./ng-app

WORKDIR /ng-app

COPY package.json package-lock.json ./
RUN npm ci

COPY ./src ./src
COPY ./angular.json ./tsconfig.json ./tsconfig.app.json  ./

## Build the angular app in production mode and store the artifacts in dist folder

RUN npm run ng build --output-path=dist --configuration=production


### STAGE 2: Setup ###

FROM nginxinc/nginx-unprivileged:stable-alpine

USER root

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /ng-app/dist/homev2 /usr/share/nginx/html

EXPOSE 8080

#CMD ["nginx", "-g", "daemon off;"]
