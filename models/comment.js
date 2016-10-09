var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
   author: {type: Schema.Types.ObjectId, ref: 'User'},
   content: {type: String, required: true},
   date: {type: Number, required: true}
});

module.exports = mongoose.model('Comment', schema);
