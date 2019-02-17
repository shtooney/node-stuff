const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

let hashedPassword = '$2a$10$ZW4PoVprAuadjA3v9uRbH.zfv3VjpyBFIcEpuk4VrMzLCVNo9yv9O';
let hashedPassword2 = '$2a$10$m66agmvKmZnNAQSuLk3BDOnrX/d5t7oKc1WHJ5XCh.VRrTF8jYwSi';

bcrypt.compare(password, hashedPassword2, (err, res) => {
    console.log(res);
});

/*
let data = {
    id: 10
};

let token = jwt.sign(data, '123abc');
console.log('----> ', token);
let decoded = jwt.verify(token, '123abc');
console.log('+++> ', decoded);


let message = 'I am user number 3';
let hash = SHA256(message).toString();
let hash1 = SHA256(message).toString();

console.log('-----------');
console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);
console.log(`Hash: ${hash1}`);
console.log('-----------');

let data = {
    id: 4
};

let token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
};

//token.data.id = 5;
//token.hash = SHA256(JSON.stringify(token.data)).toString();

let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if(resultHash === token.hash){
    console.log('data was not changed');
} else {
    console.log('data was changed - do not trust!');
}
*/