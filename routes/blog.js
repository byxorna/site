exports.blog_index = function(req, res){
  var fetch_size = req.poet.postsPerPage;
  var from = req.query["from"]-0 || 0;
  var to = (req.query["to"]-0)+1 || from + fetch_size;
  res.render('blog', {
    title: 'Blog',
    posts: req.poet.getPosts(from, to),
    from: from,
    to: to,
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

//exports.posts = function(req, res){
//  var page = (req.query["page"]-0) || 1;
//  var postsPerPage = req.poet.postsPerPage;
//  var lastPost = page*postsPerPage;
//  res.send(req.poet.getPosts(lastPost - postsPerPage, lastPost));
//};

// get some posts as json, takes params.from and params.to
exports.posts = function(req, res){
  var from = req.params.from-0 || 0;  //default to first post
  // remember slice(0,3) returns 3 elements, not 4. fix up to to return the correct posts
  var to = (req.params.to-0)+1 || from+req.poet.postsPerPage; //default return one page
  if (from > to) {
    var tmp = from;
    from = to;
    to = tmp;
  }
  res.send(req.poet.getPosts(from,to));
};
