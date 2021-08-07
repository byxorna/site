package main

import (
	"fmt"
	"html/template"
	"net/http"
	"os"
	"runtime/debug"
	"time"

	_ "expvar"
	_ "net/http/pprof"

	"github.com/byxorna/site"
	"github.com/byxorna/site/pkg/log"
	"github.com/byxorna/site/pkg/version"
	"github.com/spf13/cobra"
)

var (
	logger = log.New("test")
	flags  = struct {
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

	loggingMiddleware := log.Middleware(logger)
	router := http.NewServeMux()
	router.Handle("/public/", publicFS)
	middlewareifiedRouter := loggingMiddleware(router)
	/*
		mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(200)
			template, err := template.New("index").Parse(indexTemplate)

			if err != nil {
				w.WriteHeader(500)
				return
			}

			data := struct {
				Title          string
				WelcomeMessage string
			}{
				Title:          getTranslationString(lang, "title"),
				WelcomeMessage: getTranslationString(lang, "welcome_message"),
			}

			template.Execute(w, data)
		})
	*/
	logger.Infow("serving HTTP", "port", flags.httpPort)
	err := http.ListenAndServe(fmt.Sprintf(":%d", flags.httpPort), middlewareifiedRouter)

	return err
}

func handleTemplateRoute(mux http.Handler, templateName string, templateFilename string) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(200)

		tmpl, err := site.TemplatesFS.ReadFile(templateFilename)
		if err != nil {
			logger.Errorw("unable to load template", "template", templateFilename, "error", err.Error(), "trace", debug.Stack())
			w.WriteHeader(500)
			return
		}

		template, err := template.New(templateName).Parse(string(tmpl))

		if err != nil {
			w.WriteHeader(500)
			return
		}

		data := struct {
			Title   string
			Now     time.Time
			Commit  string
			Version string
			Built   string
		}{
			Title:   templateName,
			Now:     time.Now().Local(),
			Commit:  version.Commit,
			Version: version.Version,
			Built:   version.Date,
		}

		template.Execute(w, data)
	}
}
