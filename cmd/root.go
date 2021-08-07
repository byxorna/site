package main

import (
	"bytes"
	"fmt"
	"html/template"
	"net/http"
	"os"
	"time"

	_ "expvar"
	_ "net/http/pprof"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"

	"github.com/byxorna/resume"
	"github.com/byxorna/site"
	"github.com/byxorna/site/pkg/log"
	"github.com/byxorna/site/pkg/version"
	"github.com/spf13/cobra"
)

var (
	logger = log.New("site")

	md = goldmark.New(
		goldmark.WithExtensions(extension.GFM),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
		),
		goldmark.WithRendererOptions(
			html.WithHardWraps(),
			html.WithXHTML(),
		),
	)

	flags = struct {
		pprofPort int
		httpPort  int
	}{}

	root = &cobra.Command{
		Use:   "site",
		Short: fmt.Sprintf("embedded http server for pipefail.com (%s %s %s)", version.Commit, version.Commit, version.Date),
		Args:  cobra.MaximumNArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {
			logger.Infow("launching site", "version", version.Version, "commit", version.Commit, "build_date", version.Date)
			if flags.pprofPort > 0 {
				logger.Infow("Listening for pprof", "port", flags.pprofPort)
				go http.ListenAndServe(fmt.Sprintf(":%d", flags.pprofPort), nil)
			}
			return runHttpServer()
		},
	}
)

func init() {
	root.Flags().IntVar(&flags.pprofPort, "pprof-port", 6060, "pprof http listening port")
	root.Flags().IntVar(&flags.httpPort, "http-port", 8000, "http listening port")
}

func main() {
	err := root.Execute()
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func runHttpServer() error {
	publicFS := http.FileServer(http.FS(site.PublicFS))

	// load all templates
	tmpl, err := template.New("").ParseFS(site.TemplatesFS, "templates/*.html")
	if err != nil {
		return err
	}

	// load resume and convert to something useful
	var resumeHtmlBytes bytes.Buffer
	if err := md.Convert([]byte(resume.ResumeMarkdown), &resumeHtmlBytes); err != nil {
		return fmt.Errorf("unable to convert resume into HTML: %w", err)
	}
	resumeHtml := template.HTML(resumeHtmlBytes.String())

	loggingMiddleware := log.Middleware(logger)
	router := http.NewServeMux()
	router.Handle("/public/", publicFS)
	router.HandleFunc("/", templateRoute(tmpl, "Pipefail", "index.html", nil))
	router.HandleFunc("/about", templateRoute(tmpl, "About", "about.html", nil))
	router.HandleFunc("/consulting", templateRoute(tmpl, "Consulting", "consulting.html", nil))
	router.HandleFunc("/resume", templateRoute(tmpl, "Resume - Gabe Conradi", "resume.html", &resumeHtml))
	router.HandleFunc("/resume.pdf",
		servePDF(fmt.Sprintf("Gabe Conradi - Resume (%d).pdf", time.Now().Unix()), resume.ResumePDF))

	middlewareifiedRouter := loggingMiddleware(router)

	logger.Infow("serving HTTP", "port", flags.httpPort)
	return http.ListenAndServe(fmt.Sprintf(":%d", flags.httpPort), middlewareifiedRouter)
}

func servePDF(filename string, bytes []byte) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("content-type", "application/pdf")
		w.Header().Add("content-disposition", fmt.Sprintf("attachment; filename=%s", filename))
		w.Header().Add("content-length", fmt.Sprintf("%d", len(bytes)))
		w.WriteHeader(200)
		w.Write(bytes)
	}
}

func templateRoute(tmpl *template.Template, title string, templateName string, extraHTML *template.HTML) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		// so this is sus, but in order to do all our templating without writing to the request until
		logger.Infow("handling tmpl request", "name", templateName)
		// we know whether the render was successful, we use `sb` to write the body to.
		sb := bytes.NewBuffer([]byte{})

		data := struct {
			Title     string
			Now       time.Time
			Commit    string
			Version   string
			Built     string
			ExtraHTML *template.HTML
			Year      string
		}{
			Title:     title,
			Now:       time.Now().Local(),
			Commit:    version.Commit,
			Version:   version.Version,
			Built:     version.Date,
			ExtraHTML: extraHTML,
			Year:      time.Now().Local().Format("2006"),
		}

		err := tmpl.ExecuteTemplate(sb, templateName, data)
		if err != nil {
			// TODO: we cant change header after writing body... :thinking:
			//w.Header().Add("content-type", "application/json")
			w.WriteHeader(500)
			logger.Errorw("failed to render template", "err", err.Error())
			w.Write([]byte(fmt.Sprintf(`error %s, status: 500`, err.Error())))
		} else {
			w.Header().Add("content-type", "text/html")
			w.WriteHeader(200)
			w.Write([]byte(sb.String()))
		}
	}
}
