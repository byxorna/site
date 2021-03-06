var RSS = require('rss');
var _ = require('underscore');
var rss_xml;

var feed = new RSS({
  title: "Gabe Conradi's Blog",
  description: "Linux, cars, hacking, and complaining",
  feed_url: "http://pipefail.com/blog/rss.xml",
  site_url: "http://pipefail.com",
  author: "Gabe Conradi"
});


module.exports = function (blog){
  //fill the feed with the most recent 10 posts
  _.each(blog.getPosts(0,10),function(post){
    feed.item({
      title: post.title,
      date: post.date,
      description: post.content,
      url: post.url
    });
  });
  //cache the xml
  rss_xml = feed.xml();
  return exports;
};

exports.rss = function(req, res){
  var format = req.params.format;
  switch (format){
    case "xml":
      res.type('xml');
      res.send(200,rss_xml);
      break;
    default:
      res.send(404,"RSS format not found");
      break;
  }
};

exports.blog_index = function(req, res){
  var fetch_size = req.poet.postsPerPage;
  var from = 0;
  var to = from + fetch_size-1;
  var posts = req.poet.getPosts(from, to+1);
  res.render('blog', {
    title: 'Blog',
    posts: posts,
    from: from,
    to: to,
    total_posts: req.poet.getPostCount(),
    fetch_size: fetch_size
  });
};

exports.post = function(req, res){
  var post = req.poet.getPost(req.params.post);
  if(post){
    res.render('post',{
      title: post.title,
      post: post
    });
  } else {
    res.send(404);
  }
};

