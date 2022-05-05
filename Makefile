NAME := site
PACKAGE := $(shell go list .)
git_commit := $(shell git rev-parse HEAD)
git_tag := $(shell git describe --tags --always HEAD)
date := $(shell date)
pkg := $(shell go list -m)

all: build

.PHONY: build dev clean

clean:
	rm bin/site || :

build:
	go build -o bin/$(NAME) \
		-ldflags "-X '$(pkg)/pkg/version.Commit=$(git_commit)' -X '$(pkg)/pkg/version.Date=$(date)' -X '$(pkg)/pkg/version.Version=$(git_tag)'" \
		$(PACKAGE)/cmd

test: build
	go test -v ./...

dev: build
	@bin/site
	
docker:
	docker build -t byxorna/site:$(git_tag) .

pprof-heap: build
	go tool pprof http://localhost:6060/debug/pprof/heap

pprof-allocs: build
	go tool pprof http://localhost:6060/debug/pprof/allocs

pprof-profile: build
	curl -o profile.pprof http://localhost:6060/debug/pprof/profile?seconds=5
	go tool pprof profile.pprof

update-resume:
	go get github.com/byxorna/resume
	git diff go.mod
	git add go.mod go.sum
	# git commit -m "update resume"

deploy-site:
	# ssh pipefail.com sudo systemctl restart site
