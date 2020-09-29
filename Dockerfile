FROM node:13.10
MAINTAINER Gabe Conradi <gabe.conradi@gmail.com>

COPY . /app
WORKDIR /app
RUN npm install
ENTRYPOINT PORT=3000 npm start
EXPOSE 3000

