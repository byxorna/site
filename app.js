
var express = require('express')
http = require('http'),
  path = require('path'),
  app = express(),
  poet = require('poet')(app),
  moment = require('moment'),
  page = require('./routes/index'),
  blog_api = require('./routes/api/blog');
var blog;

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(require('method-override')());
app.use(poet.middleware());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/keybase.txt', express.static(path.join(__dirname, 'public/keybase.txt')));

if (app.get('env') == 'development') {
  app.use(express.errorHandler());
}

var postsPerPage = 5;
poet.set({
  posts: './posts',
  postsPerPage: postsPerPage,
  routes: {
    post: '/blog/post/:post',
    page: '/blog[?page=:page]'
  }
})
  .init(function (locals) {
    // expose postsPerPage thru middleware for proper pagination
    locals["postsPerPage"] = postsPerPage;
    setupRoutes({
      poet_locals: locals
    });
  });

function setupRoutes(opts) {
  // set up application
  blog = require('./routes/blog')(opts.poet_locals);
  // User facing routes (html)
  app.get('/', page.index);
  app.get('/about', page.about);
  app.get('/consulting', page.consulting);
  app.get('/projects', page.projects);
  app.get('/resume.:format?', page.resume);
  app.get('/blog', blog.blog_index);      // the main blog page, shows list of blog posts (html)
  app.get('/blog/rss.:format', blog.rss);
  app.get('/blog/post/:post', blog.post); // get a specific blog post for display (html)

  // API routes (json)
  // get collection of blog posts
  app.get('/api/blog/posts', blog_api.posts);
  app.get('/api/blog/posts/:from-:to', blog_api.posts);
  app.get('/api/blog/posts/:from', blog_api.posts);

  http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
  });
}


