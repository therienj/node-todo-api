const {ObjectId} = require ('mongodb');
var objectId = new ObjectId;
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/users');

// Todo.remove ({}).then((result) => {
//   console.log(result);
// });

Todo.findOneAndRemove({_id: '5900ddd8d5191275ecd9440d'}).then((todo) => {
  console.log(todo);
});

//Todo.findByIdAndRemove

Todo.findByIdAndRemove('5900ddd8d5191275ecd9440d').then ((todo) =>{
  console.log(todo);
});
