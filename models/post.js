var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  imagePath: {type: String, required: true},
  title: {type: String, required: true},
  description: {type: String, required: true},
  date: {type: Number, required: true},
  author: {type: String, required: true},
  content: {type: String, required: true},
  comments: {type: Array, required: true }
});

module.exports = mongoose.model('Post', schema);
