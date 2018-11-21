const crypto = require('crypto');
const { Block, BlockChain, Pow, getBalanceOfAddr } = require('./src/utils');
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

const userAddrs = {
  Andy: "1",
  Kevin: "2",
  Joe: "3",
};

let transactionMsg;
const blockChain = new BlockChain();

console.log("Andy is mining...")
blockChain.minePendingTransaction(userAddrs.Andy);
console.log("Andy mines a new block")
console.log(`Andy's balance: ${getBalanceOfAddr(blockChain.blocks, blockChain.pendingTransactions, 1)}`)

console.log("Keivin is mining...")
blockChain.minePendingTransaction(userAddrs.Kevin);
console.log("Kevin mines a new block")
console.log(`Kevin's balance: ${getBalanceOfAddr(blockChain.blocks, blockChain.pendingTransactions, 2)}`)

console.log("Andy --->  Kevin: 50")
transactionMsg = blockChain.createTransaction(userAddrs.Andy, userAddrs.Kevin, 50);
console.log(transactionMsg)
console.log(`Andy's balance: ${getBalanceOfAddr(blockChain.blocks, blockChain.pendingTransactions, 1)}`)
console.log(`Kevin's balance: ${getBalanceOfAddr(blockChain.blocks, blockChain.pendingTransactions, 2)}`)

console.log("Joe --->  Andy: 50")
transactionMsg = blockChain.createTransaction(userAddrs.Joe, userAddrs.Andy, 50);
console.log(transactionMsg)
console.log(`Andy's balance: ${getBalanceOfAddr(blockChain.blocks, blockChain.pendingTransactions, 1)}`)
console.log(`Joe's balance: ${getBalanceOfAddr(blockChain.blocks, blockChain.pendingTransactions, 3)}`)

console.log("Kevin ---> Joe")
transactionMsg = blockChain.createTransaction(userAddrs.Kevin, userAddrs.Joe, 25);
console.log(transactionMsg)
console.log(`Kevin's balance: ${getBalanceOfAddr(blockChain.blocks, blockChain.pendingTransactions, 2)}`)
console.log(`Joe's balance: ${getBalanceOfAddr(blockChain.blocks, blockChain.pendingTransactions, 3)}`)

console.log("Joe is mining...")
blockChain.minePendingTransaction(userAddrs.Joe);
console.log("Joe mines a new block")
console.log(`Joe's balance: ${getBalanceOfAddr(blockChain.blocks, blockChain.pendingTransactions, 3)}`)





let {height, prevBlockHash, Time, Bits, Transcations, Hash, nonce} = blockChain.blocks[0];
console.log(`\nblockChain first block: \n${height}\n${prevBlockHash}\n${Time}\n${Bits}\ntransactions: ${Transcations}\n${Hash}\n${nonce}`);
console.log(`prevHash  of second block: ${blockChain.blocks[1].prevBlockHash}`);

console.log("\nFinish transaction. Result:\n")
console.log(`Chain length: ${blockChain.blocks.length}`)
console.log(`Andy's balance: ${getBalanceOfAddr(blockChain.blocks, blockChain.pendingTransactions, 1)}`)
console.log(`Kevin's balance: ${getBalanceOfAddr(blockChain.blocks, blockChain.pendingTransactions, 2)}`)
console.log(`Joe's balance: ${getBalanceOfAddr(blockChain.blocks, blockChain.pendingTransactions, 3)}`)
