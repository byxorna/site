// home page
exports.index = function(req, res){
  res.render('index', { title: 'byxor.na' });
};

// about me
exports.about = function(req, res){
  res.render('about', {title: 'About'});
};

// resume listing
exports.resume = function(req, res){
  res.render('resume', {title: 'Resume'});
};

exports.projects = function(req, res){
  res.render('projects', {title: 'Projects'});
};
