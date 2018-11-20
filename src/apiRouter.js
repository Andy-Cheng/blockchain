/**
 * @file Manages routings and api designs.
 */
const blockChainRouter = require('express').Router();
const multer  = require('multer')();
const { blockModel } = require('./mongoose-db');
const apiMsg = require('./apiMsg');
const { blockReadOptions, blockChainReadOptions, mineBlockOptions, transactionAddOptions } = require('./multerOption');
const { Block, BlockChain, Pow } = require('./utils');

// Initialize a blockchain.
const blockChain = new BlockChain();
// note: remember to filter chainId.

// blockChain api
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
    });
});

// Mine a new block
blockChainRouter.post('/mine/block', multer.fields(mineBlockOptions), async(req, res, next) =>{
    console.log('api: mine block');
    const { ChainId, MinerAddr } = req.body;
    console.log(`ChainId: ${ChainId}, Miner address: ${MinerAddr}`)
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
                block = blockChain.minePendingTransaction(ChainId, MinerAddr, true);
            }
            // To do: add POW mechanism here.
            //Normal Block
            else{
                console.log("Chain is not empty, so let's apeend the new block to the end of the chain.");
                console.log("prevInfo", prevInfo)
                block = blockChain.minePendingTransaction(ChainId, MinerAddr, false, prevInfo[0]);
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

// Add a new Transaction
blockChainRouter.post('/add/transaction', multer.fields(transactionAddOptions), async(req, res, next) =>{
    console.log('api: add transaction');
    const { ChainId, FromAddr, ToAddr, amount } = req.body;
    console.log(`ChainId: ${ChainId}, from: ${FromAddr}, to: ${ToAddr}, amount: ${amount}`)

    const cb1 = (blocks)=>{
        blockChain.createTransaction(ChainId, FromAddr, ToAddr, amount, blocks);
        console.log("now pending transactions are:\n")
        blockChain.pendingTransactions.map( (pendingTx) =>{
            console.log(`Tx: ${pendingTx.ChainId}, ${pendingTx.FromAddr}, ${pendingTx.ToAddr}, ${pendingTx.amount}`);
        });
        console.log("\n");
        res.status(200).json("add transaction successfully.")
    };

    blockModel.find({ChainId: ChainId})
    .exec(cb1);
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

module.exports = {
    blockChainRouter
};