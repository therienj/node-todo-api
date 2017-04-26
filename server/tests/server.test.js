const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');
const {app}= require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectId(),
  text: 'Premier test todo'
}, {
  _id: new ObjectId(),
  text: 'Deuxième test todo'
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then (() => done());
});

describe('POST /todos', () => {
  it('devrait créer un nouveau todo', (done) => {
    var text = 'Premier test todo';

    request(app)
    .post('/todos')
    .send({text})
    .expect (200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
      if (err) {
         return done(err);
       }
       Todo.find({text}).then((todos) => {
         expect(todos.length).toBe(2);
         expect(todos[0].text).toBe(text);
         done();
       }).catch ((e) => done(e));
     });
  });

    it('Ne doit pas créer de todo avec du mauvais data', (done) => {
      request(app)
        .post ('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch ((e) => done(e));
      });
  });
});

describe ('GET/ /todos', () => {
  it('Doit retourner tous les todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2);
  })
    .end(done);
});
});

//test un id si retour de todo
describe('GET /todos/:id', () => {
  it('Doit retourner un todo', (done) => {
    request(app)
    .get(`/todos/${todos[0]}._id.toHexString()}`)
    .expect(200)
    .expect ((res) => {
      expect(res.body.todos.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('retourne un  404 pour aucun todo trouver', (done) => {
    request(app)
    .get(`/todos/${todos[0]}._id.toHexString()}`)
    .expect(404)
    .end(done);
  });


  it('retourne un  404 pour aucun objet todo', (done) => {
    request(app)
    .get('/todos/123abc')
    .expect(404)
    .end(done);
  });
});
