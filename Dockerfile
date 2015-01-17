FROM byxorna/nodejs
MAINTAINER Gabe Conradi <gummybearx@gmail.com>

COPY . /app
RUN npm install
EXPOSE 3000

