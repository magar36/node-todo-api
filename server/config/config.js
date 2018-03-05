var env = process.env.NODE_ENV || 'development';

if(env === 'development'){
  process.env.PORT = 2400;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/ToDoApp';
}else if(env === 'test'){
  process.env.PORT = 2400;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/ToDoAppTest';
}else{
  process.env.MONGODB_URI = 'mongodb://arjunsingh.agarwal275:Dec1988@ds155278.mlab.com:55278/apptododb';
};
