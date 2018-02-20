const expect = require('expect');
const supertest = require('supertest');

const {
  app
} = require('./../server');
const {
  ToDo
} = require('./../models/todo');

beforeEach((done) => {
  ToDo.remove({}).then(() => done());
});

describe('POST /todos', () => {
  it('should create a test todo', (done) => {

    var text = 'Trying to post a test todo';

    supertest(app)
      .post('/todo')
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

        ToDo.find().then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

it('should give an error as empty body is sent' , (done) => {

  var text = '';

  supertest(app)
    .post('/todo')
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text)
    })
    .end((err, resp) => {
      if(err) {
        return done(err);
      }

      ToDo.find().then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));
    });


});

});
