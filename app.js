
var express = require('express')
  page = require('./routes/index'),
  blog = require('./routes/blog'),
  blog_api = require('./routes/api/blog'),
  http = require('http'),
  path = require('path'),
  app = express(),
  poet = require('poet')(app),
  moment = require('moment');

//TODO this is ghetto, but i dont know how to get poet's postsPerPage
// to be exposed in its middleware. remove when https://github.com/jsantell/poet/pull/10
// is merged in
var postsPerPage = 5;
poet.set({
  posts: './posts',
  postsPerPage: postsPerPage,
  routes: {
    post: '/blog/post/:post',
    page: '/blog[?page=:page]'
  }
})
  .init(function(locals){
    // expose postsPerPage thru middleware for proper pagination
    locals["postsPerPage"] = postsPerPage;
    locals.postList.forEach(function(post) { });
  });

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(poet.middleware());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function(){
  app.use(express.errorHandler());
});

// User facing routes (html)
app.get('/', page.index);
app.get('/about', page.about);
app.get('/projects', page.projects);
app.get('/resume.:format?', page.resume);
app.get('/blog', blog.blog_index);      // the main blog page, shows list of blog posts (html)
app.get('/blog/post/:post', blog.post); // get a specific blog post for display (html)

// API routes (json)
// get collection of blog posts
app.get('/api/blog/posts', blog_api.posts);
app.get('/api/blog/posts/:from-:to', blog_api.posts);
app.get('/api/blog/posts/:from', blog_api.posts);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
