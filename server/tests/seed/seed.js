 const {ObjectId} = require('mongodb');
 const jwt = require ('jsonwebtoken');

 const {Todo} = require('./../../models/todo');
 const {Users} = require('./../../models/users');

 const userOneId = new ObjectId();
 const userTwoId = new ObjectId();

 const DateString = Date("YYYY-mm-ddTHH:MM:ssZ");

const users = [{
  _id: userOneId,
  email: 'abc@mail.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, acces: 'auth'}, '123abc' ).toString()
  }]
}, {
  _id: userTwoId,
  email: 'j@ville.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, acces: 'auth'}, '123abc' ).toString()
  }]
}];

const populateUsers = (done) => {

  Users.remove({}).then (() => {
     var userOne = new Users(users[0]).save();
     var userTwo = new Users(users[1]).save();
     return Promise.all([userOne, userTwo])
  }).then(() => done());

};

const todos = [{
  _id: new ObjectId(),
  text: 'Premier test todo',
  _creator: userOneId
}, {
  _id: new ObjectId(),
  text: 'Deuxième test todo',
  completed: true,
  completedAt: DateString,
  _creator: userTwoId
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then (() => done());
};



module.exports = {users, populateUsers, todos, populateTodos};
