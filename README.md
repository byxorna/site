# site

Gabe Conradi's personal website ([pipefail.com](https://pipefail.com))

## Releases

Releases are built automatically from tags (see [/releases](https://github.com/byxorna/site/releases)), with both binaries and docker images.

- [Docker Hub: byxorna/site](https://hub.docker.com/repository/docker/byxorna/site)

```
$ docker run -p 8000:8000 byxorna/site:latest
```

### Create new release



## Updating Resume

The resume is sourced from [byxorna/resume](https://github.com/byxorna/resume). To pull in the latest copy:

```
$ make update-resume
```

## Hacking

Build the site:

```
$ make
```

Run a dev server:

```
$ make dev
```

# Docs

[pkg.go.dev/github.com/byxorna/site](https://pkg.go.dev/github.com/byxorna/site)
