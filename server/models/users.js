//créer le modèle de notre document(table)
var mongoose = require('mongoose');

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

// var newUsers = new Users({
//   nom: 'Pierre'
// });
//
// newUsers.save().then((doc) => {
//   console.log('Commit 4',JSON.stringify(doc, undefined, 2) );
// }, (e) => {
//   console.log('Impossible de créer le document', e);
// });

 module.export = {Users};
