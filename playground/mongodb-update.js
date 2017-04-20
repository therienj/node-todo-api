const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Impossible de se connecter à la base de données');
  }
  console.log('Connecté à la base de données');

  db.collection('Users').findOneAndUpdate({
    //permier param: filtre pour le document recherché
    _id: new ObjectID ('58f78b56cedca8206caea91d')
  }, {
    //deuxième param: opérateur set value nom champs et nouvelle valeur
    $set: {
      nom: 'Jacques'
    },
    $inc: {
      age: 1
    }
  }, {
    //troisième param: retourne ancien si vrai, sinon nouveau record
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  //db.close();
});
