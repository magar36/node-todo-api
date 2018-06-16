const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
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
// UserSchema.methods.somefunc = function() {
//   var user = this;
//   userObj = user.toObject();
//   return _.pick(userObj, ['_id']);
// };

//advantage of using toJSON: no need to make an explicit call
//is called directly by JSON.stringify which is called by res.send

UserSchema.methods.toJSON = function() {
  var user = this;
  userObj = user.toObject();
  return _.pick(userObj, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function(){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function(token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  })
};

UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;

try{
  decoded = jwt.verify(token, process.env.JWT_SECRET);
} catch(e) {
  return Promise.reject();
};

return User.findOne({
  '_id': decoded._id,
  'tokens.token': token,
  'tokens.access': 'auth'
});

};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if(!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res){
          resolve(user);
        } else{
          reject();
        }
      })
    });
  });
};

UserSchema.pre('save', function (next) {
  var user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('Users', UserSchema);

module.exports = {User};
