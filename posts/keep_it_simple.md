{{{
  "title": "Keep it simple",
  "date": "Tue Feb 12 20:40:34 EST 2013"
}}}

Here is a bit about why I really appreciate the design of [Express](http://expressjs.com/) and a lot of Node modules, and conversely, why Rails (and other all encompassing projects) rub me the wrong way.

I have been kind of negative about Rails before, but without ever suggesting a decent alternative. Most of what I dislike about rails is that its Rails' way, or the highway. It is natural to provide everything in the kitchen sink as a project grows larger. Unfortunately, I find large, sprawling projects like this harder to work with. There is always the drive to understand _how_ the asset pipeline works, _why_ autoload works how it does, and how to create your app within the design vision of the framework creator. When I use Rails, I need to understand the intended structure of a Rails app, how to use bundler, what rake tasks do what, scaffolding, asset compilation, shady DSLs for things like routing and "helpers", etc etc etc.

With Express, it is a much lighter and understandable framework. It does what its advertised purpose is: talk http by taking requests, and returning responses. Dead simple. I can keep a simple app in one file and not sacrifice any readability, or can scale it up to act just like Rails can. By keeping the API surface (and underlying code) small and understandable, I can easily tell where Express starts and ends, and what it is responsible for. I need only understand what is necessary to implement my desired level of complexity, and no more. By this measure, I am sure I would really like Sinatra too. I'll admit I havent played with it though, as I was searching for a language with a better community to back it up than Ruby.

In the same vein, I really like [Poet](https://github.com/jsantell/poet) for file based blog generation. Instead of providing a canned solution, it allows you to bootstrap your blog very easily, while remaining infinitely extensible and totally transparent. Instead of using the pre-canned solution Poet provides for easy setup, I decided to customize my blog to implement an API for clientside MVC, and use different routes than default. My blog was set up with only a few lines of code, and is exactly how Poet was intended to be used (no monkeypatching here!):

      var poet = require('poet')(app);

      // provide poet as middleware to requests
      app.use(poet.middleware());

      // set up poet
      var postsPerPage = 5; 
      poet.set({
        posts: './posts', // where my posts markdown lives
        postsPerPage: postsPerPage,
        routes: {
          post: '/blog/post/:post',
          page: '/blog[?page=:page]'
        }
      }).init(function(locals){
        // provide users of middleware access to the number of posts per page
        // fix in https://github.com/jsantell/poet/pull/10
        locals["postsPerPage"] = postsPerPage;
      });

      // set my routes
      app.get('/blog', blog.blog_index);
      app.get('/blog/rss.:format', blog.rss);
      app.get('/blog/post/:post', blog.post);
      app.get('/api/blog/posts', blog_api.posts);
      app.get('/api/blog/posts/:from-:to', blog_api.posts);
      app.get('/api/blog/posts/:from', blog_api.posts);

Then, I can easily set up my API actions:

      // blog API
      // returns a set of posts as json
      exports.posts = function(req, res){
        var from = req.params.from-0 || 0;  //default to first post
        var to = (req.params.to-0)+1 || from+req.poet.postsPerPage; //default return one page
        if (from > to) {
          var tmp = from;
          from = to; 
          to = tmp;
        }
        res.send(req.poet.getPosts(from,to));
      };

Done!

I think having a comprehensive view of how the module[s] you are using work is a great thing, and is in __stark__ contrast to the modern fad of devops, where you just require a gem, or run a receipe, and it works like magic. I should probably stop there, because I can rant for days on the DevOps mentality.

__tl;dr__ The UNIX way works. Keep modules small, single purpose, and easily combinable.

