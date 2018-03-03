const mongoose =  require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://arjunsingh.agarwal275:Dec@1988@ds155278.mlab.com:55278/apptododb' || 'mongodb://localhost:27017/ToDoApp');

module.exports = {
  mongoose
};
