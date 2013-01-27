
var express = require('express')
  page = require('./routes/index'),
  blog = require('./routes/blog'),
  http = require('http'),
  path = require('path'),
  app = express(),
  poet = require('poet')(app);

poet.set({
  posts: './posts'
})
  .init(function(){
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

app.get('/', page.index);
app.get('/about/me', page.about_me);
app.get('/projects', page.projects);
app.get('/resume', page.resume);
app.get('/blog', blog.blog_index);
app.get('/blog/post/:post', blog.post);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
