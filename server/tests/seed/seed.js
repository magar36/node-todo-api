const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {ToDo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const testTodos = [{
    _id: new ObjectID(),
    text: 'sample todo 1'
  },
  {
    _id: new ObjectID(),
    text: 'sample todo 2',
    completed: true,
    completedAt: 123
  }
];

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const testUsers = [{
    _id: userOneId,
    email: 'user1@gmail.com',
    password: 'userOnePwd',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'},'key123')
      }]
  },
  {
    _id: userTwoId,
    email: 'user2@gmail.com',
    password: 'userTwoPwd'
  }
];

const populateTodos = (done) => {
  ToDo.remove({}).then(() => {
    return ToDo.insertMany(testTodos);
  }).then(() => done());
}

const populateUsers = (done) => {
  User.remove({}).then(() => {

    var userOneDoc = new User(testUsers[0]).save();
    var userTwoDoc = new User(testUsers[1]).save();
    return Promise.all([userOneDoc, userTwoDoc]);

  }).then(() => done());
};

module.exports = {
  testTodos,
  populateTodos,
  testUsers,
  populateUsers,
}
