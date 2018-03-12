const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

// var name = 'mohit';
// var hash = SHA256(name).toString();
// console.log(hash);

var data = {
  id: 1
};

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

var sign = jwt.sign(data,'123');
console.log(sign);

var verify = jwt.verify(sign, '123');
console.log(verify);
