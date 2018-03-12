const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    lowercase:true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access:{
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

//Instead of overriding an existing method toJSON, we can define a new function and call it from server.js
// userSchema.methods.somefunc = function() {
//   var user = this;
//   userObj = user.toObject();
//   return _.pick(userObj, ['_id']);
// };

//advantage of using toJSON: no need to make an explicit call
//is called directly by JSON.stringify which is called by res.send

userSchema.methods.toJSON = function() {
  var user = this;
  userObj = user.toObject();
  return _.pick(userObj, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = function(){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access},'key123');

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  });
};

var User = mongoose.model('Users', userSchema);

module.exports = {User};
