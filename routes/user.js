var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Post = require('../models/post');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function(req,res,next){
  var user = req.user;
  var userComments =[];
  Post.find(function(err, docs){
    for(var i = 0; i<docs.length; i++){
      var currentComment = docs[i].comments.find(function(comment){
        return comment.author === user.username;
      });
      if (currentComment){
      userComments.push(currentComment);
      }
    };
    console.log(userComments);
    res.render('user/profile', {user: user, userComments: userComments});
  });
});



router.get('/logout', isLoggedIn, function (req,res,next){
  req.logout();
  res.redirect('/');
});


router.use('/', notLoggedIn, function(req,res,next){
  next();
});


router.get('/signup', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signup', {csrfToken : req.csrfToken(), messages: messages, hasErrors: messages.length>0});
});

router.post('/signup', passport.authenticate('local.signup',{
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));


router.get('/signin', function(req,res,next){
  var messages = req.flash('error');
  res.render('user/signin', {csrfToken : req.csrfToken(), messages: messages, hasErrors: messages.length>0});
});

router.post('/signin', passport.authenticate('local.signin',{
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}));

module.exports = router;



function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
};



function notLoggedIn (req, res, next) {
  if (!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
};
