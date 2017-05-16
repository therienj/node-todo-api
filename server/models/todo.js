//créer le modèle de notre document(table)
var mongoose = require('mongoose');

var DateString = Date("YYYY-mm-ddTHH:MM:ssZ");

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: String,
    default: DateString
  }, _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true 
  }
});


module.exports = {Todo};
