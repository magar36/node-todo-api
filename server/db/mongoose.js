const mongoose =  require('mongoose');

mongoose.Promise = global.Promise;

// var uriObj = {
// localDb: 'mongodb://localhost:27017/ToDoApp',
// mLab: 'mongodb://arjunsingh.agarwal275:Dec1988@ds155278.mlab.com:55278/apptododb'
// };

//mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ToDoApp');
//mongoose.connect(process.env.PORT ?  uriObj.mLab : uriObj.localDb);
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
  mongoose
};
