//const MongoClient = require('mongodb').MongoClient;

//Object destructuring
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, client) => {
  if(err){
  return  console.log('Error connecting to the database ', err);
};
  console.log('Connected successfully from node app');

  const db = client.db('ToDoApp');

  db.collection('Todos').insertOne({
    text: 'some to do',
    completed: false
  }, (err, result) => {
    if(err){
    return  console.log('Error connecting to the database ', err);
    }

    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  db.collection('Users').insertOne({
    name: 'Mohit Agarwal',
    age: 30,
    location: 'AZ'
  }, (err, result) => {
    if(err){
    return  console.log('Error connecting to the database ', err);
    }

    console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));

  });

  client.close();
});
