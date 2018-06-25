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
const {authenticate} = require('./middleware/middleware');


var app = express();

app.use(parser.json());

app.post('/todos', authenticate, (req, res) => {
  //console.log(req.body);

  var todo = new ToDo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos', authenticate, (req, res) => {

  ToDo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({
      todos
    });
  }, (e) => {
    res.status(400).send(e);
  });

});

app.get('/todos/:id', authenticate, (req, res) => {

  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  };

  ToDo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({
      todo
    });
  }).catch((e) => {
    res.status(400).send();
  });

});

app.delete('/todos/:id', authenticate, async (req, res) => {

  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  };

try {
  var todo = await ToDo.findOneAndRemove({_id: id, _creator: req.user._id});
  if(!todo){
      return res.status(404).send();
    };
  res.send({todo});
} catch (e) {
  res.status(404).send();
};


// ToDo.findOneAndRemove({
//   _id: id,
//   _creator: req.user._id
// }).then((todo) => {
//   if(!todo){
//     return res.status(404).send();
//   };
//   res.send({todo});
// }).catch((e) => {
//   res.status(400).send();
// });

});


app.patch('/todos/:id', authenticate, (req, res) => {

  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  };

  var body = _.pick(req.body, ['text', 'completed']);

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  ToDo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  },
    {
      $set:body
    },
    {
      new: true
    }
  ).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });

});

app.post('/users', async (req, res) => {

  var userParams = _.pick(req.body, ['email', 'password']);
  var userInput = new User(userParams);
  try {
    await userInput.save();
    var token = await userInput.generateAuthToken();
    res.header('x-auth', token).send(userInput);
  } catch (e) {
    res.status(400).send(e);
  }

  //next two lines of code can be replaced with the commented line below
  //userInput.generateAuthToken().then((token) => {

  // userInput.save().then(() => {  //same as userInput.save().then((user); return user.generateAuthToken();
  //   return userInput.generateAuthToken();
  // }).then((token) => {
  //   res.header('x-auth', token).send(userInput);
  // }).catch((e) => {
  //   res.status(400).send(e);
  // });

});


app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});


app.post('/users/login', async (req, res) => {

  try {
    var body = _.pick(req.body, ['email', 'password']);
    var user = await User.findByCredentials(body.email, body.password);
    var token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send();
  }

  // const User.findByCredentials(body.email, body.password).then((user) => {
  //     return user.generateAuthToken().then((token) => {
  //       res.header('x-auth', token).send(user);
  //     });
  //   }).catch((e) => {
  //   res.status(400).send();
  // });
});


app.delete('/users/me/token', authenticate, async (req, res) => {
try{
  const removeToken = await req.user.removeToken(req.token);
  res.status(200).send();
} catch (e) {
  res.status(400).send();
}

// replace below with async await
  // req.user.removeToken(req.token).then(() => {
  //   res.status(200).send();
  // }).catch((e) => {
  //   res.status(400).send();
  // })
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = {
  app
};
