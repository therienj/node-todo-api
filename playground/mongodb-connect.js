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

  // db.collection('Todos').insertOne({
  //   texte: 'Un quatrième insert',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Impossible insérer un document (record)', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });
  //
  // db.collection('Users').insertOne({
  //   nom: 'Jacques',
  //   age: 60,
  //   location: 'Montréal'
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Impossible insérer un document (record)', err);
  //   }
  //   //console.log(JSON.stringify(result.ops, undefined, 2));
  //   console.log(result.ops[0]._id.getTimestamp());
  // });
  //
  // db.collection('Users').insertOne({
  //   nom: 'Johanne',
  //   age: 59,
  //   location: 'Berri'
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Impossible insérer un document (record)', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  db.close();
});
