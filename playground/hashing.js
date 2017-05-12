const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var DateString = Date("YYYY-mm-ddTHH:MM:ssZ");

console.log(`On commence le hashing  à : ${DateString}`);

 var password = 'password_2';

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//     DateString = Date("YYYY-mm-ddTHH:MM:ssZ");
//     console.log(`On terminne le hashing  à : ${DateString}`);
//   });
// });

var hashedPassword = '$2a$10$8VMXjCmO23nVyc.wWu/NQ.Etf6H36odpTJ0evIa8yeb3mRZJxu932';
 bcrypt.compare(password, hashedPassword, (err, res) => {
   console.log(res);
 });


// var data = {
//   id: 10
// };
//
// var token = jwt.sign(data, '123abc');
// console.log('Le token: ',token);
//
// var verifiedToken = jwt.verify(token, '123abc');
// console.log('Le token vérifié: ',verifiedToken);

// var message = 'Je suis l\'utilisateur # 3';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 5
// };
//
// var token = {
//   data: data,
//   hash: SHA256(JSON.stringify(data) + 'unsecret').toString()
// };
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString;
//
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'unsecret').toString();
//
//   if (resultHash === token.hash) {
//     console.log('Data non changé');
//   } else {
//     console.log('Data changé, ne pas faire confiance.');
//   }
