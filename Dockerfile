FROM golang:1.26 AS build

WORKDIR /go/src/app
COPY . .

RUN make

FROM debian:bookworm-slim

COPY --from=build /go/src/app/bin/site /site

ENTRYPOINT ["/site"]
