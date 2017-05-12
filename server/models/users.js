//créer le modèle de notre document(record)
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require ('jsonwebtoken');
const _ = require('lodash');
var bcrypt = require('bcryptjs');

// var Users = mongoose.model('Users', {
//   email: {
//     type: String,
//     required: true,
//     minlength: 1,
//     trim: true,
//     unique: true,
//     validate: {
//       validator: validator.isEmail,
//       message: '{value} n\'est pas valide'
//     }
//   },
//      password: {
//       type: String,
//       require: true,
//       minlength: 6
//     },
//       tokens: [{
//         access: {
//           type: String,
//           required: true
//     },
//       token:{
//           type: String,
//           required: true
//         }
//       }]
// });

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      isAsync: true,
      validator: validator.isEmail,
      message: '{value} n\'est pas valide'
    }
  },
     password: {
      type: String,
      require: true,
      minlength: 6
    },
      tokens: [{
        access: {
          type: String,
          required: true
    },
      token:{
          type: String,
          required: true
        }
      }]
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, '123abc').toString();

  user.tokens.push({access, token});
  return user.save().then (() => {
    return token;
  });
};

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, '123abc');
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id' : decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

//Avant la sauvegarde on vérifie si le password est changé et on encrypte le nouveau
UserSchema.pre('save', function (next) {
  var user = this;
  var userObject = user.toObject();
  var email = _.pick(userObject, ['email']);
  var psw = _.pick(userObject, ['password']);

  if (user.email === email['email']) {
    // console.log('Même courriel');
    // console.log(user.email);
    // console.log(email['email']);

      if (user.password != psw['password']) {
        // console.log(user.password);
        // console.log(psw['password']);
        console.log('Password modifié');

        bcrypt.genSalt(10, (err, salt) =>{
          bcrypt.hash(user.password, salt, (err, hash) =>{
            user.password = hash;
           next();
        });
      });

    } else {
      //console.log('Mot de passe inchangé.');
      //  console.log(user.password);
      //  console.log(psw['password']);
       next();
     }
  } else {
    // console.log('nouveau courriel');
    // console.log(user.email);
    // console.log(email['email']);
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) =>{
        user.password = hash;
        next();
    });
});
}
});

UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var Users = mongoose.model('Users', UserSchema );

 module.exports = {Users};
