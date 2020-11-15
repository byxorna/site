var
  _ = require('underscore'),
  fs = require('fs'),
  md = require('node-markdown');

// home page
exports.index = function(req, res){
  res.render('index', { title: 'Home' });
};

// about me
exports.about = function(req, res){
  res.render('about', {title: 'About'});
};

exports.consulting = function(req, res){
  res.render('consulting', {title: 'Consulting Services'});
};

// resume listing
exports.resume = function(req, res){
  var format = req.params.format || 'html';
  switch(format) {
    case 'html':
    case 'md':
      fs.readFile('node_modules/resume/resume.md','utf8',function(err,resume_md){
        if (err) res.send(500,err);
        res.render('resume', {title: 'Resume', resume: md.Markdown(resume_md)});
      });
      break;
    case 'pdf':
      var file = fs.createReadStream('./node_modules/resume/resume.pdf');
      var stat = fs.statSync('./node_modules/resume/resume.pdf');
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=Gabe Conradi Resume.pdf');
      file.pipe(res);
      break;
    default:
      res.send(404,"Resume not available in that format");
      break;
  }
};

exports.projects = function(req, res){
  res.render('projects', {title: 'Projects'});
};
