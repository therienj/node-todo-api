//créer le modèle de notre document(record)
var mongoose = require('mongoose');

var DateString = Date("YYYY-mm-ddTHH:MM:ssZ");

var Users = mongoose.model('Users', {
  nom: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    default: 'adresse@email.com'
  },
  completedAt: {
    type: String,
    default: DateString
  }
});

 module.exports = {Users};
