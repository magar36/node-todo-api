const expect = require('expect');
const supertest = require('supertest');
const {ObjectID} = require('mongodb');

const {
  app
} = require('./../server');
const {
  ToDo
} = require('./../models/todo');

var testTodos = [
  {
    _id: new ObjectID(),
    text: 'sample todo 1',
  },
  {
    _id: new ObjectID(),
    text: 'sample todo 2',
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

        ToDo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

it('sending an empty text' , (done) => {

  var text = '';

  supertest(app)
    .post('/todos')
    .send({text})
    .expect(400)
    .end((err, resp) => {
      if(err) {
        return done(err);
      }

      ToDo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done(e));
    });


});

});

describe('GET /todos' , () => {
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
      expect (resp.body.todo.text).toBe(testTodos[0].text);
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
