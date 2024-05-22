# Stage 1: Build the React Application
FROM node:20.12.2 AS build
COPY ./*.js ./
COPY ./*.json ./
COPY ./*.sh ./
COPY ./.* ./
COPY ./src ./src
COPY ./openApi/scripts ./openApi/scripts

RUN npm install jq
RUN yarn install
RUN yarn generate
RUN yarn start:local

## Stage 2: Setup the Nginx Server to serve the React Application
#FROM nginx:1.25.0-alpine AS run
##COPY --from=build ./build /usr/share/nginx/html
#COPY ./build /usr/share/nginx/html
#COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
