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

