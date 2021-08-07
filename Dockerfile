FROM golang:1.16-buster AS build

WORKDIR /go/src/app
COPY . .

RUN make

FROM debian:buster-slim

COPY --from=build /go/src/app/bin/site /site

ENTRYPOINT ["/site"]
