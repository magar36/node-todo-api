const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {ToDo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//var id = '5a8d1e7fdc4d7b0e242fbcff';

//below id is valid but does not exist in database
//var id = '6a8d1e7fdc4d7b0e242fbcff';

//invalid id
var id = '6a8d1e7fdc4d7b0e242fbcffa'

var idUser = '5a8a3fb120b51dd79b6e8ede';

if (!ObjectID.isValid(id))
{
console.log('Invalid ID.')
};

ToDo.find({
  _id: id
}).then((sometodo) => {
  console.log(sometodo);
});

ToDo.findOne({
  _id: id
}).then((sometodo) => {
  console.log(sometodo);
});


ToDo.findById(id).then((sometodo) => {
  if(!sometodo) {
    return console.log('Id not found');
  }
  console.log(sometodo);
})
.catch((e) => {
  console.log(e);
});

User.findById(idUser).then((someuser) => {
  if(!someuser){
    return console.log('User not found.');
  }
  console.log(JSON.stringify(someuser, 2, undefined));
});
