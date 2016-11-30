FROM node:7.2.0
MAINTAINER Gabe Conradi <gummybearx@gmail.com>

COPY . /app
WORKDIR /app
RUN npm install
ENTRYPOINT PORT=3000 npm start
EXPOSE 3000

