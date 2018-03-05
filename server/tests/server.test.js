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

var testTodos = [{
    _id: new ObjectID(),
    text: 'sample todo 1',
  },
  {
    _id: new ObjectID(),
    text: 'sample todo 2',
    completed: true,
    completedAt: 123
  }
];

beforeEach((done) => {
  ToDo.remove({}).then(() => {
    return ToDo.insertMany(testTodos);
  }).then(() => done());
});

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
