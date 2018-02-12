const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, client) => {
  if(err){
    return console.log('Error connecting the database');
  }

  const db = client.db('ToDoApp');

  // db.collection('Todos').find({completed:true}).toArray().then((res) => {
  //     db.collection('Todos').find({
  //       _id: new ObjectID('5a813d85360b737dfedec149')
  //     }).toArray().then((res) => {
  //     console.log(JSON.stringify(res, undefined, 2));
  //     }).catch((err) => {
  //       console.log(err);
  // });
  db.collection('Todos').find().count().then((count) => {
  console.log(`count is: ${count}`);
  }).catch((err) => {
    console.log(err);
});


});
