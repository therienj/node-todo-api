const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app}= require('./../server');
const {Todo} = require('./../models/todo');
const {Users} = require('./../models/users');
const {users, populateUsers, todos, populateTodos} = require('./seed/seed');
const http = require('http');

beforeEach(populateUsers);
beforeEach(populateTodos);


describe ('GET/ /todos', () => {
  it('Doit retourner tous les todos', (done) => {
    request(app)
    .get('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(1);
  })
    .end(done);
});
});

//test un id si retour de todo
describe('GET /todos/:id', () => {
  it('Doit retourner un todo', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect ((res) => {
      expect(res.body.todos.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('Ne Doit pas retourner un todo de un autre usager', (done) => {
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('retourne un  404 pour aucun todo trouver', (done) => {
    var hexId = new ObjectId().toHexString();

    request(app)
    .get(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });


  it('retourne un 404 pour aucun objet todo', (done) => {
    request(app)
    .get('/todos/123abc')
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('devrait supprimer un document (record)', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todos._id).toBe(hexId);
    })
    .end((err, res) =>{
      if (err) {
        return done(err);
      }
      Todo.findById(hexId).then((todos) => {
        expect(todos).toNotExist();
        done();
      }).catch ((e) => done(e));
    });
  });

  it('ne devrait supprimer un todo de un autre', (done) => {
    var hexId = todos[0]._id.toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end((err, res) =>{
      if (err) {
        return done(err);
      }
      Todo.findById(hexId).then((todos) => {
        expect(todos).toExist();
        done();
      }).catch ((e) => done(e));
    });
  });

  
  it('retourne 404 si aucun todo trouvé', (done) => {
    var hexId = new ObjectId().toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('retourne 404 si id invalide', (done) => {
    request(app)
    .delete('/todos/123abc')
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  });
});

describe('PATCH /todos/:id', () => {

  it('doit màj todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'dans le test Patch';

    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .send({
      text: text,
      completed: true
    })
    .expect(function ok(res) {
    if (res.status !== 200) {
        var b = http.STATUS_CODES[res.status];
        return new Error('expected 200, got ' + res.status + ' "' + b + '" with message: ' + res.text);
    }
})
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.text).toBe(text);
      expect(res.body.todos.completed).toBe(true);
      expect(res.body.todos.completedAt).toBe(DateString);
    })
    .end(done);
  });

  it('ne doit pas màj todo créé par autre usager', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'dans le test Patch';
    //var DateString = Date("YYYY-mm-ddTHH:MM:ssZ");

    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .send({
      text: text,
      completed: true
    })
    .expect(404)
    .end(done);
  });

  it('si non complété, completedAt est null', (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = '!!!Dans le test Patch!!!';

    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .send({
      completed: false,
      completedAt: null,
      text: text
    })
    .expect(function ok(res) {
    if (res.status !== 200) {
        var b = http.STATUS_CODES[res.status];
        return new Error('expected 200, got ' + res.status + ' "' + b + '" with message: ' + res.text);
    }
})
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.text).toBe(text);
      expect(res.body.todos.completed).toBe(false);
      expect(res.body.todos.completedAt).toBe(null);
    }).end(done);
  });

});

describe ('GET /users/me', () => {
  it('Doit retourner l usager selon son token', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
   })
    .end(done);
});

  it('retourne 401 si non authentifier', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
         expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /todos', () => {
  it('devrait créer un nouveau todo', (done) => {
    var text = 'Premier test todo';

    request(app)
    .post('/todos')
    .set('x-auth', users[0].tokens[0].token)
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
        .set('x-auth', users[0].tokens[0].token)
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

describe('POST /users', () => {
  it('Doit créer un usager', (done) => {
    var email = 'exemple@abc.com';
    var password = '123mb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.header['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err, res) => {
        Users.findOne({email}).then ((users) => {
          expect(users).toExist();
          expect(users.password).toNotBe(password);
          done();
        }).catch((e)=> done(e));
      });
  });

  it('Retourne une erreur de validation', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'somethings',
        password: '123'
      })
      .expect(400)
      .end(done);
    });

  it('Ne doit pas créer de doublons email', (done) => {
    request(app)
    .post('/users')
    .send({
      email: users[0].email,
      password: 'Password123!'
    })
    .expect(400)
    .end(done);
  });
});

describe('POST /users/login', () => {
  it('doit faire le login et retourne un token.', (done) => {
    request(app)
      .post('/users/login')
      .send ({
        email: users[1].email,
        password: users[1].password
      })
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toExist();
        })
        .end((err,res) => {
          if (err) {
            return done(err);
          }

          Users.findById(users[1]._id).then((user) => {
            expect(user.tokens[1]).toInclude({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          }).catch((e)=> done(e));
        });
  });

  it('doit rejeter le login.', (done) => {
    request(app)
      .post('/users/login')
      .send ({
        email: users[1].email,
        password: users[1].password + '1'
      })
        .expect(400)
        .expect((res) => {
          expect(res.headers['x-auth']).toNotExist();
        })
        .end((err,res) => {
          if (err) {
            return done(err);
          }

          Users.findById(users[1]._id).then((user) => {
            expect(user.tokens.length).toBe(1);
            done();
          }).catch((e)=> done(e));
        });
  });

});

describe('DELETE /users/me/token', () => {
  it('doit supprimer par token après logout',(done) =>{
      request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err,res) => {
        if (err) {
          return done(err);
        }

        Users.findById(users[0]._id).then((user) => {
         expect(user.tokens.length).toBe(0);
         done();
       }).catch ((e) => done(e));
      });
    });
});