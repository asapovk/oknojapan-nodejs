var express = require('express');
var router = express.Router();

var Post = require('../models/post');
var Comment = require('../models/comment');


/* GET home page. */
router.get('/', function(req, res, next) {
  Post.find(function(err, docs){
    console.log(docs);
    res.render('blog/index', { title: 'Hey! Welcome to node-shopping-cart', posts: docs });
  });
});


router.get('/blog/:id', function (req,res,next){
  var postId = req.params.id;
  var post = Post.findById(postId, function (err, result) {
    if (err){
      return redirect('/');
    }
    res.render('blog/single', {post: result });
  });
});

router.post('/blog/:id', function(req,res,next){
  console.log('POST WORKS');
  var postId = req.params.id;
  var user = req.user;
  var content = req.body.commentText;
  var newComment = new Comment ({
    author: user.username,
    content: content,
    date: 10
  });
  console.log(postId);
  Post.findById(postId, function (err,result){
    if(err){
      return res.send('An error occured!');
    }
    var comments = result.comments;
    comments.push(newComment);
    console.log(comments);

  Post.update({_id: postId}, {comments: comments},  function(err,result){
      if(err){
        return res.send('An error occured!');
      }
      res.redirect('/blog/'+postId);
    });
  });

});


module.exports = router;
