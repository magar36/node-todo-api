var mongoose =  require('mongoose');

mongoose.Partial = global.Partial;
mongoose.connect('mongodb://localhost:27017/ToDoApp');

module.exports = {
  mongoose
};
