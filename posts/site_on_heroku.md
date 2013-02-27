{{{
  "title": "Deployed to Heroku",
  "date": "Tue Feb 26 21:48:08 EST 2013"
}}}

I finally deployed this site to [Heroku](http://heroku.com)! After wading through hoardes of poorly designed "free" hosting sites, I remembered Heroku allows one free web dyno, which is all I need for this site. I really enjoy how minimal and easy heroku is:

    $ git push heroku master
    Counting objects: 5, done.
    Delta compression using up to 2 threads.
    Compressing objects: 100% (2/2), done.
    Writing objects: 100% (3/3), 282 bytes, done.
    Total 3 (delta 1), reused 0 (delta 0)
    -----> Node.js app detected
    -----> Resolving engine versions
           Using Node.js version: 0.8.19
           Using npm version: 1.1.65
    -----> Fetching Node.js binaries
    -----> Vendoring node into slug
    -----> Installing dependencies with npm
    ... npm crap ...
    -----> Building runtime environment
    -----> Discovering process types
           Procfile declares types -> web

    -----> Compiled slug size: 11.6MB
    -----> Launching... done, v9
           http://hidden-tor-9074.herokuapp.com deployed to Heroku

    To git@heroku.com:hidden-tor-9074.git
       2baa7e9..8c0c907  master -> master

    $ heroku ps:scale web=1
    Scaling web processes... done, now running 1

    $ curl http://hidden-tor-9074.herokuapp.com

Next I need to register a domain. The hardest problem in programming is naming, and that definitely extends to domain names. [.tk](http://www.dot.tk/) may be an option.
