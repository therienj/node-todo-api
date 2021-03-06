require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb')
global.DateString = Date("YYYY-mm-ddTHH:MM:ssZ");

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {Users} = require('./models/users');
var {authenticate} = require('./middleware/authenticate');
var bcrypt = require('bcryptjs');

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
   text: req.body.text,
   _creator: req.user._id
  });

  todo.save().then ((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (e)=>{
    res.status(400).send(e);
  });
});


// Get /todos/_id

app.get('/todos/:id', authenticate,  (req, res) => {
  var id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
    }).then((todos) => {
      if (!todos) {
        return res.status(404).send();
      }

    res.send({todos});
  }).catch ((e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then ((todos) =>{
    if (!todos) {
      return res.status(404).send();
    }
    res.send({todos});
  }, (e) => {
    res.status(400).send();
  });

});

app.patch('/todos/:id', authenticate, (req, res) =>{
  var id = req.params.id;
  var body = _.pick(req.body, ['_id', 'text', 'completed', 'completedAt']);


  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = DateString;
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({ _id: id, _creator: req.user._id},{$set: body}, {new: true}).then ((todos) => {
    if (!todos) {
      return res.status(404).send();
    }

    res.send({todos});

  }).catch ((e) => {
    res.status(400).send();
  })
});

app.patch('/users/:email/:password', (req, res) =>{
  var id = req.params.id;
  var p_email = req.params.email;
  var p_psw = req.params.password;
  var body = _.pick(req.body, ['_id', 'email', 'password']);

  if (body.email != p_email) {
    //on pourrait ici offrir à l'usager de créer son compte si il n'existe pas
    //ou recommencer si il s'est trompé
    return res.status(404).send();
  }

  if (body.password != p_psw) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(p_psw, salt, (err, hash) =>{
        res.password = hash;
        body.password = res.password;

        var query = {email: p_email};
        Users.findOneAndUpdate(query, {$set: { password: body.password}},{new: true}).then ((users) => {
          if (!users) {
            return res.status(404).send();
          }
          res.send(users);
        }).catch ((e) => {
          res.status(400).send();
       })
      });
    });

} else {
  console.log('Mot de passe inchangé.');
  return res.status(400).send();
}
});


app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

//post email
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new Users(body);

  user.save().then (() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send();
  }).catch((e) => {
    res.status(400).send(e);
  })
});
// POST /users/login {email, password}

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['_id','email', 'password']);

    Users.findByCredentials(body.email, body.password).then ((user) => {
      //res.send(user);
      return user.generateAuthToken().then((token) => {
       res.header('x-auth', token).send(user);
     });
    }).catch((e) => {
      res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log (`Serveur démarré sur le port : ${port}`);
});

module.exports = {app};
