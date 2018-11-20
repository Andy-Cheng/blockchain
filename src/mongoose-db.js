/**
 *@file Defines schemas of collections.
 */

require('./connect');
const mongoose = require('mongoose');


// define the schema of blocks
const blockSchema = new mongoose.Schema({
    ChainId: String,
    height: Number,
    prevBlockHash: String,
    Time: Date,
    Bits: Number,
    Transcations: Array,
    Hash: String,
    Nonce: Number
});

/*
// define the schema of blockchains
const blockChainSchema = new mongoose.Schema({
    GensisHash: String,
    BlocksHash: {type: [String], default: undefined}
  });
*/

const pendingTransactionSchema = new mongoose.Schema({
    ChainId: String,
    FromAddr: String,
    ToAddr: String,
    amount: Number
});

// initiate models
const blockModel = mongoose.model('blocks', blockSchema);
const pendingTransactionModel = mongoose.model('pendingTransaction', pendingTransactionSchema);
// const blockChainModel = mongoose.model('blockChains', blockChainSchema);


module.exports = {
    blockModel,
    pendingTransactionModel
    // blockChainModel
};