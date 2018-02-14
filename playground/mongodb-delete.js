const {
  MongoClient,
  ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, resp) => {
  if (err) {
    return console.log('Error happened while connecting to the database server');
  }

  const db = resp.db('ToDoApp');

  // db.collection('Users').deleteOne({
  //   name: 'Mohit Agarwal'
  // }).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Users').deleteMany({
  //   name: 'Mohit Agarwal'
  // }).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndDelete({
    _id: new ObjectID('5a813d85360b737dfedec14a')
  }).then((result) => {
    console.log(result);
  });

});
