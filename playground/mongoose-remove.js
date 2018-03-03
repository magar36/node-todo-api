const {mongoose} = require('./../server/db/mongoose');
const {ToDo} = require('./../server/models/todo');

// ToDo.remove({}).then((res) => {
//   console.log(res);
// });

// ToDo.findByIdAndRemove('5a9b16f5f0d2e84e05eec585').then((res) => {
//   console.log(res);
// });

ToDo.findOneAndRemove({_id: '5a9b16f6f0d2e84e05eec586'}).then((res) => {
  console.log(res);
});
