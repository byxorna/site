package site

import (
	"embed"
)

var (
	//go:embed public/*
	PublicFS embed.FS

	//go:embed templates/*
	TemplatesFS embed.FS
)
