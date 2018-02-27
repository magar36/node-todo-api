const express = require('express');
const parser = require('body-parser');
const {ObjectID} = require('mongodb');

const {
  mongoose
} = require('./db/mongoose');
const {
  ToDo
} = require('./models/todo');
const {
  User
} = require('./models/user');

var app = express();

app.use(parser.json());

app.post('/todos', (req, resp) => {
  //console.log(req.body);
  var todoInstance = new ToDo(req.body);
  todoInstance.save().then((doc) => {
    resp.send(doc);
  }, (err) => {
    resp.status(400).send(err);
  });
});

app.get('/todos', (req, resp) => {

  ToDo.find().then((todos) => {
    resp.send({
      todos
    });
  }, (e) => {
    resp.status(400).send(e);
  });

});

app.get('/todos/:id', (req, resp) => {

  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return resp.status(404).send();
  };

  ToDo.findById(id).then((todo) => {
    if(!todo){
      return resp.status(404).send();
    }
    resp.send({todo});
  }).catch((e) => {
    resp.status(400).send();
  });

});

app.listen(2400, () => {
  console.log('Listening on port 2400');
});

module.exports = {
  app
};
