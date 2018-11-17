/**
 *@file Defines schemas of collections.
 */

require('./connect');
const mongoose = require('mongoose');


// define the schema of blocks
const blockSchema = new mongoose.Schema({
    height: Number,
    prevBlockHash: String,
    Time: Date,
    Bits: Number,
    Transcations: String,
    Hash: String,
    Nonce: Number
});

// define the schema of blockchains
const blockChainSchema = new mongoose.Schema({
    GensisHash: String,
    BlocksHash: {type: [blockSchema], default: undefined}
  });



// initiate models
const blockModel = mongoose.model('blocks', blockSchema);
const blockChainModel = mongoose.model('blockChains', blockChainSchema);


module.exports = {
    blockModel,
    blockChainModel
};