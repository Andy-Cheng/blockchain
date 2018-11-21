const { Transaction, BlockChain,  getBalanceOfAddr, isChainValid } = require('./src/utils');

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const blocks = [];

// Your private key goes here
const myKey = ec.keyFromPrivate('36b8ea2ae1c6617826641cd8fe38e66cc90fa2020f6fde59f778a297df0539ff');

// From that we can calculate your public key (which doubles as your wallet address)
const myWalletAddress = myKey.getPublic('hex');

// Create new instance of Blockchain class
const blockChain = new BlockChain();
blocks.push(blockChain.minePendingTransaction("1", myWalletAddress, true));

// Create a transaction & sign it with your key
const tx1 = new Transaction("1", myWalletAddress, 'address2', 50);
tx1.signTx(myKey);
blockChain.addTransaction(tx1, blocks);

// Mine block
blocks.push(blockChain.minePendingTransaction("1", myWalletAddress, false, blocks[0]) );

// Create second transaction
const tx2 = new Transaction("1", myWalletAddress, 'address1', 50);
tx2.signTx(myKey);
blockChain.addTransaction(tx1, blocks);

// Mine block
blocks.push(blockChain.minePendingTransaction("1", myWalletAddress, false, blocks[1]) );


console.log();
console.log(`Balance of andy is ${getBalanceOfAddr(blocks, blockChain.pendingTransactions, myWalletAddress)}`);

// Uncomment this line if you want to test tampering with the chain
// blocks[1].transactions[0].amount = 10;

// Check if the chain is valid
console.log();
console.log('Blockchain valid?', isChainValid(blocks)? 'Yes' : 'No');
