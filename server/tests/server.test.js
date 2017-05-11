const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app}= require('./../server');
const {Todo} = require('./../models/todo');
const {Users} = require('./../models/users');
const {users, populateUsers, todos, populateTodos} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

// describe ('GET/ /users', () => {
//   it('Doit retourner tous les users', (done) => {
//     request(app)
//     .get('/users')
//     .expect(200)
//     .expect((res) => {
//       expect(res.body.users.length).toBe(2);
//    })
//     .end(done);
// });
// });

//test un id si retour de todo
describe('GET /todos/:id', () => {
  it('Doit retourner un todo', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect ((res) => {
      expect(res.body.todos.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('retourne un  404 pour aucun todo trouver', (done) => {
    var hexId = new ObjectId().toHexString();

    request(app)
    .get(`/todos/${hexId}`)
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

describe('DELETE /todos/:id', () => {
  it('devrait supprimer un document (record)', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todos._id).toBe(hexId);
    }).end((err, res) =>{
      if (err) {
        return done(err);
      }
      Todo.findById(hexId).then((todos) => {
        expect(todos).toNotExist();
        done();
      }).catch ((e) => done(e));
    });
  });
  it('retourne 404 si aucun todo trouvé', (done) => {
    var hexId = new ObjectId().toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .expect(404)
    .end(done);
  });

  it('retourne 404 si id invalide', (done) => {
    request(app)
    .delete('/todos/123abc')
    .expect(404)
    .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('doit màj todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'dans le test Patch';
    //var DateString = Date("YYYY-mm-ddTHH:MM:ssZ");

    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      text: text,
      completed: true,
      completedAt: DateString
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.text).toBe(text);
      expect(res.body.todos.completed).toBe(true);
      expect(res.body.todos.completedAt).toBe(DateString);
    }).end(done);
  });

  it('si non complété, completedAt est null', (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = '!!!Dans le test Patch!!!';

    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      completed: false,
      completedAt: null,
      text: text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.text).toBe(text);
      expect(res.body.todos.completed).toBe(false);
      expect(res.body.todos.completedAt).toBe(null);
    }).end(done);
  });

});
