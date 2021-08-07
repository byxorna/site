package site

import (
	"embed"
)

var (
	//go:embed public/*
	PublicFS embed.FS

	//go:embed templates/*
	TemplatesFS embed.FS

	//go:embed templates/header.html
	HeaderTemplate string
	//go:embed templates/footer.html
	FooterTemplate string
)
