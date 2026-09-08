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

The resume is sourced from [byxorna/resume](https://github.com/byxorna/resume) as a Go module embed. The Go module proxy caches aggressively, so `go get` without a specific ref often serves a stale version.

To pull in the latest copy:

```
$ make update-resume
```

If the proxy is still stale, pin to the exact commit from the resume repo:

```
$ go get github.com/byxorna/resume@<commit-sha>
$ git add go.mod go.sum
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
