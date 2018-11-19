const crypto = require('crypto');
const { Block, BlockChain, Pow } = require('./src/utils');
// const cipher = crypto.createHash('sha256');

// var message = 'hello';
// var digest = cipher.update(message, 'utf8').digest('base64'); 

// console.log(digest.length);
/*
const calculateHash = (data) =>{
    const cipher = crypto.createHash('sha256');
    cipher.update(data, 'utf8');         

    return cipher.digest('hex');
};
let data = "abcfsf" + "ss" + "sss"; 
console.log(calculateHash(data))
console.log(parseInt(calculateHash(data), 16))
*/

const blockChain = new BlockChain();
const {height, prevBlockHash, Time, Bits, Transcations, Hash, nonce} = blockChain.blocks[0];
console.log(`\nblockChain first block: \n${height}\n${prevBlockHash}\n${Time}\n${Bits}\ntransactions: ${Transcations}\n${Hash}\n${nonce}`);