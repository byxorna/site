exports.blog_index = function(req, res){
  var page = (req.query["page"]-0) || 1;
  var postsPerPage = req.poet.postsPerPage;
  var lastPost = page*postsPerPage;
  console.log(lastPost-postsPerPage,lastPost);
  res.render('blog', {
    title: 'Blog',
    posts: req.poet.getPosts(lastPost - postsPerPage, lastPost),
    page: page
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
