const {ObjectId} = require ('mongodb');
var objectId = new ObjectId;
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/users');

 //var id = '58fe22551692c91b3c6c1c31';

// Les 2 manières fonctionnent pour un document, mais 1 retourne un tableau, 2
// à priviliégié retourne le document comme tel

// 1

// Todo.find({
//   _id: id
// }).then ((todos) => {
//   console.log('Todos', todos);
// });
//
//
// // 2
//
// Todo.findOne({
//   _id: id
// }).then ((todo) => {
//   console.log('Todo', todo);
// });

// 3

// Todo.findById(id).then ((todo) => {
//   if(!todo) {
//     return console.log('Id incorrecte')
//   }
//   console.log('Todo by Id', todo);
// }).catch ((e) => console.log (e));

// Users.findById(id).then ((users) => {
//   if(!users) {
//     return console.log('Aucun usager')
//   }
//   console.log('Usager by Id', users);
// }).catch ((e) => console.log (e));
if(objectId.isValid){
 Todo.findById(id).then ((todo) => {
   console.log('Id: ',id);
  if(!todo) {
    return console.log('Id incorrecte')
  }
  console.log('Todo by Id', todo);
}).catch ((e) => console.log (e));
}else{
  return id;
};
