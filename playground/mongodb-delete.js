const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Impossible de se connecter à la base de données');
  }
  console.log('Connecté à la base de données');

//delete many
  //  db.collection('Users').deleteMany({nom: 'Johanne'}).then((result) => {
  //    console.log(result);
  //  });

  //delete one
  // db.collection('Todos').deleteOne({texte: 'Un deuxième insert'}).then((result) => {
  //   console.log(result);
  // });


  //find one and delete
  db.collection('Users').findOneAndDelete({_id: new ObjectID ('58f7a826080049132012ae27')}).then((result) => {
    console.log(JSON.stringify(result, undefined, 2));
  });

  //db.close();
});
