//créer le modèle de notre document(table)
var mongoose = require('mongoose');

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
  }
});

// var newTodo = new Todo({
//   texte: 'Date en String'
// });

module.exports = {Todo};
