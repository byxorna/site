FROM --platform=$BUILDPLATFORM golang:1.26 AS build

ARG TARGETOS
ARG TARGETARCH

WORKDIR /go/src/app
COPY . .

RUN GOOS=$TARGETOS GOARCH=$TARGETARCH make

FROM debian:bookworm-slim

COPY --from=build /go/src/app/bin/site /site

ENTRYPOINT ["/site"]
