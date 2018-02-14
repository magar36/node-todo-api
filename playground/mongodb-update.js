const {
  MongoClient,
  ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, resp) => {
  if (err) {
    return console.log('Error happened while connecting to the database server');
  }

  const db = resp.db('ToDoApp');

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5a83e6289d695add6ff2372a')
  }, {
    $set: {
      name: 'Mohit Agarwal'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((resp) => {
    console.log(resp);
  });
});