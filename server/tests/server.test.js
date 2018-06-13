const expect = require('expect');
const supertest = require('supertest');
const {
  ObjectID
} = require('mongodb');

const {
  app
} = require('./../server');
const {
  ToDo
} = require('./../models/todo');
const {
  User
} = require('./../models/user');
const {testTodos, populateTodos, testUsers, populateUsers} = require('./seed/seed');


beforeEach(populateTodos);
beforeEach(populateUsers);


describe('POST /todos', () => {
  it('should create a test todo', (done) => {

    var text = 'Trying to post a test todo';

    supertest(app)
      .post('/todos')
      .send({
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, resp) => {
        if (err) {
          return done(err);
        }

        ToDo.find({
          text
        }).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('sending an empty text', (done) => {

    var text = '';

    supertest(app)
      .post('/todos')
      .send({
        text
      })
      .expect(400)
      .end((err, resp) => {
        if (err) {
          return done(err);
        }

        ToDo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });


  });

});

describe('GET /todos', () => {
  it('should get todo list', (done) => {
    supertest(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      }).
    end(done);
  });
});


describe('GET /todos/:id', () => {
  it('should get todo based on id', (done) => {
    supertest(app)
      .get(`/todos/${testTodos[0]._id.toHexString()}`)
      .expect(200)
      .expect((resp) => {
        expect(resp.body.todo.text).toBe(testTodos[0].text);
      })
      .end(done);
  });

  it('should return 404 if no id found', (done) => {
    supertest(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for invalid id', (done) => {
    supertest(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
  });

});


describe('DELETE /todos/:id', () => {

  it('should remove todo', (done) => {

    var id = testTodos[1]._id.toHexString();

    supertest(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect((resp) => {
        expect(resp.body.todo._id).toBe(id);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        };

        ToDo.findById(id).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      })

  });

  it('should send 404 if todo not found', (done) => {

    var id = new ObjectID().toHexString();

    supertest(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done)
  });

  it('should send 404 if object id is invalid', (done) => {
    supertest(app)
      .delete(`/todos/123`)
      .expect(404)
      .end(done)
  });

});


describe('PATCH /todos/:id', () => {

  it('should update the todo' , (done) => {

    var id = testTodos[0]._id.toHexString();
    var reqBody = {
      text: "testing first patch",
      completed: true
    };

    supertest(app)
      .patch(`/todos/${id}`)
      .send(reqBody)
      .expect(200)
      .expect((resp) => {
        expect(resp.body.todo.completed).toBe(true);
        expect(resp.body.todo.text).toBe(reqBody.text);
        expect(resp.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

it('should clear completedAt when todo is not completed', (done) => {

  var id = testTodos[1]._id.toHexString();
  var reqBody = {
    text: "testing second patch",
    completed: false
  };

  supertest(app)
    .patch(`/todos/${id}`)
    .send(reqBody)
    .expect(200)
    .expect((resp) => {
      expect(resp.body.todo.text).toBe(reqBody.text);
      expect(resp.body.todo.completed).toBe(false);
      expect(resp.body.todo.completedAt).toNotExist();
    })
    .end(done);

});

});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
      supertest(app)
        .get('/users/me')
        .set('x-auth', testUsers.tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(testUsers[0]._id.toHexString());
          expect(res.body.email).toBe(testUsers[0].email);
        })
        .end(done);
    });

    it('should return 401 if user not authenticated', (done) => {
      supertest(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
          expect(res.body).toEqual({});
        })
        .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
      var email = 'test@test.com';
      var password = 'test123';

      supertest(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toExist();
          expect(res.body._id).toExist();
          expect(res.body.email).toBe(email);
        })
        .end((err) => {
          if(err) {
            return done(err);
          }

          User.findOne({email}).then((testUser) => {
            expect(testUser).toExist();
            expect(testUser.password).toNotBe(password);
            done();
          }).catch((e) => done(e));

        });
    });

    it('should return validation errors if user invalid', (done) => {
      supertest(app)
        .post('/users')
        .send({
          email: 'someemail@test.com',
          password: 'fake'
        })
        .expect(400)
        .end(done);
    });

    it('should not create user if email in use', (done) => {
      supertest(app)
        .post('/users')
        .send({
          email: testUsers[0].email,
          password: 'fake123'
        })
        .expect(400)
        .end(done);
    });
});


describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {

      supertest(app)
        .post('/users/login')
        .send({
          email: testUsers[1].email,
          password: testUsers[1].password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toExist();
        })
        .end((err, res) => {
          if(err) {
            return done(err);
          }

          User.findById(testUsers[1]._id).then((testUser) => {
            expect(testUser.tokens[0]).toInclude({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          }).catch((e) => done(e));

        });
    });

    it('should reject invalid login', (done) => {
      supertest(app)
        .post('/users/login')
        .send({
          email: testUsers[1].email,
          password: testUsers[1].password + '1',
        })
        .expect(400)
        .expect((res) => {
          expect(res.headers['x-auth']).toNotExist();
        })
        .end((err, res) => {
          if(err) {
            return done(err);
          }

          User.findById(testUsers[1]._id).then((testUser) => {
            expect(testUser.tokens.length).toBe(0);
            done();
          }).catch((e) => done(e));

        });
    });


});


describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {

      supertest(app)
        .delete('/users/me/token')
        .set('x-auth', testUsers[0].tokens[0].token)
        .expect(200)
        .end((err, res) => {
          if(err) {
            return done(err);
          }

          User.findById(testUsers[0]._id).then((testUser) => {
            expect(testUser.tokens.length).toBe(0);
            done();
          }).catch((e) => done(e));

        });
    });

});
