const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ToDoApp');

var TodoModel = mongoose.model('ToDo', {
  text: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: String
  }
});

var todoInstance = new TodoModel({
  text: 'first mongoose test',
  completed: true,
  completedAt: new Date().toString()
});

todoInstance.save().then((doc) => {
  console.log(`The document is \n ${doc}`);
}, (e) => {
  console.log('Error saving the data', e);
});

//mongoose does type casting automatically based on the model property

var UserModel = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
    minLength: 1
  }
});

var UserInstance = new UserModel({
  email: 'abc@gmail.com'
});

UserInstance.save().then((doc) => {
  console.log(JSON.stringify(doc, undefined, 2));
}, (e) => {
  console.log('Unable to Save the data \n', e);
});