//les 2 lignes suivantes s'équivalent
//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

//de cette façon on attribut l'id nous même plutôt que par mongo
//var obj = new ObjectID();
//console.log(obj);

//même principe avec un objet
// var user = {name: 'Jacques', age: 25};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Impossible de se connecter à la base de données');
  }
  console.log('Connecté à la base de données');

  db.collection('Users').find({age: 59}).toArray().then((docs) => {
    console.log(JSON.stringify(docs, undefined, 2));
  });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count:  ${count}`);
  // }, (err) => {
  //   console.log('Erreur de sélect');
  // });


  //db.close();
});
