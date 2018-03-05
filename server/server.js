const config = require('./config/config');

const _ = require('lodash');
const express = require('express');
const parser = require('body-parser');
const {
  ObjectID
} = require('mongodb');

var port = process.env.PORT;

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
  if (!ObjectID.isValid(id)) {
    return resp.status(404).send();
  };

  ToDo.findById(id).then((todo) => {
    if (!todo) {
      return resp.status(404).send();
    }
    resp.send({
      todo
    });
  }).catch((e) => {
    resp.status(400).send();
  });

});

app.delete('/todos/:id', (req, resp) => {

  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return resp.status(404).send();
  };

ToDo.findByIdAndRemove(id).then((todo) => {
  if(!todo){
    return resp.status(404).send();
  };
  resp.send({todo});
}).catch((e) => {
  resp.status(400).send();
});

});


app.patch('/todos/:id', (req, resp) => {

  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return resp.status(404).send();
  };

  var body = _.pick(req.body, ['text', 'completed']);

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  ToDo.findByIdAndUpdate(id,
    {
      $set:body
    },
    {
      new: true
    }
  ).then((todo) => {
    if(!todo){
      return resp.status(404).send();
    }
    resp.send({todo});
  }).catch((e) => {
    resp.status(400).send();
  });

});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = {
  app
};
