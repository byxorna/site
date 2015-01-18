FROM byxorna/nodejs
MAINTAINER Gabe Conradi <gummybearx@gmail.com>

COPY . /app
RUN npm install
ENTRYPOINT PORT=3000 npm start
EXPOSE 3000

