var express = require('express');
var bodyParser = require('body-parser');

global.DateString = Date("YYYY-mm-ddTHH:MM:ssZ");

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/users');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
   texte: req.body.texte
  });

  todo.save().then ((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(3000, () => {
  console.log ('Serveur démarré sur le port 3000');
});
