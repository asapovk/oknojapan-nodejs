var Product = require('../models/post');
var mongoose = require('mongoose');

mongoose.connect('localhost:27017/oknojapan-nodejs');

var posts = [
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
    title: 'First post',
    description: 'This is my post',
    date: 10,
    author: 'Kostya',
    content: 'This is the content',
    comments : [{author: 'Kostya', content: 'Dummy content', date: 1}]
  }),
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
    title: 'Second post',
    description: 'This is Klyan post',
    date: 12,
    author: 'Kolya',
    content: 'This is the content',
    comments: [{author: 'Kostya', content: 'Dummy content', date: 1}]
  })

];


var done =0;

for (var i = 0; i < posts.length; i++) {
  posts[i].save(function(err, result){
      done++;
      if (done === posts.length) {
         exit();
      }
  });
}

function exit() {
    mongoose.disconnect();
}
