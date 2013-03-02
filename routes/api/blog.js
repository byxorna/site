// get some posts as json, takes params.from and params.to
exports.posts = function(req, res){
  var from = req.params.from-0 || 0;  //default to first post
  // remember slice(0,3) returns 3 elements, not 4. fix up to to return the correct posts
  var to = (req.params.to-0)+1 || from+1;  //default return one page
  if (from > to) {
    var tmp = from;
    from = to;
    to = tmp;
  }
  res.send(req.poet.getPosts(from,to));
};

