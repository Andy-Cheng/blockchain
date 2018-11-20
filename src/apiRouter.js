/**
 * @file Manages routings and api designs.
 */
const blockChainRouter = require('express').Router();
const multer  = require('multer')();
const { blockModel, pendingTransactionModel } = require('./mongoose-db');
const apiMsg = require('./apiMsg');
const {  blockAddOptions, mineBlockOptions, transactionAddOptions, blockReadOptions, blockChainReadOptions } = require('./multerOption');
const { Block, BlockChain, Transaction, getBalanceOfAddr } = require('./utils');

//testing data
let hash = "baa744f2bd8dd2afd98e13de0c3056cf70faef7635efb265d96ffe4d2736cdf4";
let genesisHash = "93bfd81989ed6feff36abe0228878d62298fd6ffa6ec92e2c3abb4744b4edc5c";

// blockChain api
// Mine a new block
blockChainRouter.post("add/block", multer.fields(mineBlockOptions), async(req, res, next) => {
    console.log('api: Mine block');
    const { ChainId, MinerAddr } = req.body;
    console.log(`ChainId: ${ChainId}, MinerAddr: ${MinerAddr}`)
    // Find prevHash and prev Height
    const cb1 = async (err, prevInfo) =>{
        if(err){
            console.log(`find prev block error: ${err}`);
            res.status(200).json("find prevBlock failed");
        }
        else{
            let block = {};
            //Genesis Block
            if(prevInfo.length == 0){
                console.log("Chain is still empty, so let's create one.")
                block = BlockChain.NewGenesisBlock(`Chain ${ChainId} first miner address: ` + MinerAddr);
            }
            // To do: add POW mechanism here.
            //Normal Block
            else{
                console.log("Chain is not empty, so let's apeend the new block to the end of the chain.");
                block = BlockChain.NewBlock(Transcations, prevInfo[0].Hash, prevInfo[0].height);
            }
            let newBlock = {
                ChainId: ChainId,
                height: block.height,
                prevBlockHash: block.prevBlockHash,
                Time: block.Time,
                Bits: block.Bits,
                Transcations: block.Transcations,
                Hash: block.Hash,
                Nonce: block.nonce,
            };
            // add a new block
            const newBlockInstance = new blockModel(newBlock);
            console.log("newblock", newBlockInstance);
            await newBlockInstance.save((err) =>{
                if (err) {
                    console.log(`New BlockInstance saved  error: ${err}`);
                    res.status(200).json({ apiMsg: apiMsg.blockSavedUnSuccessfully });
                }
                else {
                    console.log('New BlockInstance saved successfully');
                    res.status(200).json({ apiMsg: apiMsg.blockSavedSuccessfully });
                }
            });
        }
    }

    blockModel.find({ChainId: ChainId})
            .sort({height: -1})
            .select("height Hash")
            .exec(cb1);
});
// Add Transaction
blockChainRouter.post("add/transaction", multer.fields(transactionAddOptions), async(req, res, next) => {

});
// Read a block
blockChainRouter.get('/read/block', multer.fields(blockReadOptions), async (req, res, next)=>{
    console.log('api: read block');
    const { ChainId, height } = req.body
    // Find block ginven its heigth and chainId.
    await blockModel.findOne({ChainId: ChainId, height: height}, function(err, block){
        if(err){
            console.log(`find block error: ${err}`);
            res.status(200).json({apiMsg: apiMsg.blockReadUnSuccessfully});
        }
        console.log(`the result is:\n ${block}`);
        res.status(200).json(block);
    })
});

// Read a chain
blockChainRouter.get('/read/chain', multer.fields(blockChainReadOptions), async (req, res, next)=>{
    console.log('api: read chain');
    const { ChainId } = req.body
    // Find chain given its ChainId(GenesisHash)
    const cb1 = (err, blocks) =>{
        if(err){
            console.log(`read chain err: ${err}`);
            res.status(200).json({apiMsg: apiMsg.blockChainReadSuccessfully});
        }
        else{
            res.status(200).json({blocksOnChain: blocks});
        }
    };

    await blockModel.find({ChainId: ChainId})
            .sort({height: 1})
            .exec(cb1);
});

// Add a new block
blockChainRouter.post('/add', multer.fields(blockAddOptions), async(req, res, next) =>{
    console.log('api: add block');
    const { ChainId, Transcations } = req.body;
    console.log(`ChainId: ${ChainId}, Transcations: ${Transcations}`)
    // Find prevHash and prev Height
    const cb1 = async (err, prevInfo) =>{
        if(err){
            console.log(`find prev block error: ${err}`);
            res.status(200).json("find prevBlock failed");
        }
        else{
            let block = {};
            //Genesis Block
            if(prevInfo.length == 0){
                console.log("Chain is still empty, so let's create one.")
                block = BlockChain.NewGenesisBlock(`Chain ${ChainId} first transaction: ` + Transcations);
            }
            // To do: add POW mechanism here.
            //Normal Block
            else{
                console.log("Chain is not empty, so let's apeend the new block to the end of the chain.");
                block = BlockChain.NewBlock(Transcations, prevInfo[0].Hash, prevInfo[0].height);
            }
            let newBlock = {
                ChainId: ChainId,
                height: block.height,
                prevBlockHash: block.prevBlockHash,
                Time: block.Time,
                Bits: block.Bits,
                Transcations: block.Transcations,
                Hash: block.Hash,
                Nonce: block.nonce,
            };
            // add a new block
            const newBlockInstance = new blockModel(newBlock);
            console.log("newblock", newBlockInstance);
            await newBlockInstance.save((err) =>{
                if (err) {
                    console.log(`New BlockInstance saved  error: ${err}`);
                    res.status(200).json({ apiMsg: apiMsg.blockSavedUnSuccessfully });
                }
                else {
                    console.log('New BlockInstance saved successfully');
                    res.status(200).json({ apiMsg: apiMsg.blockSavedSuccessfully });
                }
            });
        }
    }

    blockModel.find({ChainId: ChainId})
            .sort({height: -1})
            .select("height Hash")
            .exec(cb1);
});

module.exports = {
    blockChainRouter
};