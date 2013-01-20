// home page
exports.index = function(req, res){
  res.render('index', { title: 'byxor.na' });
};

// about me
exports.about_me = function(req, res){
  res.render('about_me', {title: 'About'});
};

// resume listing
exports.resume = function(req, res){
  res.render('resume', {title: 'Resume'});
};

exports.projects = function(req, res){
  res.render('projects', {title: 'Projects'});
};
