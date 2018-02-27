const expect = require('expect');
const supertest = require('supertest');

const {
  app
} = require('./../server');
const {
  ToDo
} = require('./../models/todo');

var testTodos = [
  {
    text: 'sample todo 1',
  },
  {
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
