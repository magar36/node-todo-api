const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var samplePwd = 'mohit123';

//bcrypt async callback:
// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(samplePwd, salt, (err, hash) => {
//     console.log(hash);
//   })
// });

//var hashedPwd = '$2a$10$zjfo02hx/bMX/uACOkJ0o.8NdhyuWn7E8JoIclXw34mXdphgpRt4i'
var hashedPwd = '$2a$10$CpQ87bgJNwQZV822p8/F2Oa6DElVs3mWc4RPdVWXYuLaLQ/P0V/E.'
//var hashedPwd = '$2a$10$7tWVoWMlkF/lsnLk06Ktluo.Yrtnaf2AAHhtyUy2SCgHJUJsde.Zm'

bcrypt.compare(samplePwd, hashedPwd, (err, res) => {
  console.log(res);
});

// var name = 'mohit';
// var hash = SHA256(name).toString();
// console.log(hash);

// var data = {
//   id: 1
// };

// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + '123').toString()
// };
//
// origDataHash = SHA256(JSON.stringify(token.data) + '123').toString();
//
// token.data.id = 2;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// if(origDataHash == token.hash){
//   console.log('User allowed');
// }else {
//   console.log('User not allowed');
// };

//var sign = jwt.sign(data,'123');
// console.log(typeof sign);
// console.log(typeof data);
// console.log(sign);
// var verify = jwt.verify(sign, '123');
//console.log(verify);
//
//
// console.log(jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWE2MzQwZDEzZThmMjgxOWE5YTgzMzYiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTIwODQxNzQxfQ.1wpWD4_jGTI-mJk_xGCob96-bPYU6CCMxJp1TNKGHCs','key123'));
