/**
 *@file Define schemas of collections.
 */

require('./connect');
const mongoose = require('mongoose');

// Define the schema of blocks
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
const pendingTransactionSchema = new mongoose.Schema({
    ChainId: String,
    FromAddr: String,
    ToAddr: String,
    amount: Number
});
*/
// initiate models
const blockModel = mongoose.model('blocks', blockSchema);
// const pendingTransactionModel = mongoose.model('pendingTransactions', pendingTransactionSchema);

module.exports = {
    blockModel,
    // pendingTransactionModel
};