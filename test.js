const crypto = require('crypto');
// const cipher = crypto.createHash('sha256');

// var message = 'hello';
// var digest = cipher.update(message, 'utf8').digest('base64'); 

// console.log(digest.length);
const calculateHash = (data) =>{
    const cipher = crypto.createHash('sha256');
    cipher.update(data, 'utf8');         

    return cipher.digest('hex');
};
let data = "abcd" + "ss" + "sss"; 
console.log(calculateHash(data))
console.log(parseInt(data, 16))