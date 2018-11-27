/**
 * @file Manages routings and api designs.
 */
const blockChainRouter = require('express').Router();
const multer  = require('multer')();
const { blockModel } = require('./mongoose-db');
const apiMsg = require('./apiMsg');
const { blockReadOptions, blockChainReadOptions, mineBlockOptions, transactionAddOptions, getBalanceOptions, getPendingOptions, getPendingFromAddr, getPendingToAddr } = require('./multerOption');
const { BlockChain, getBalanceOfAddr, Transaction } = require('./utils');

// Initialize a blockchain.
const blockChain = new BlockChain();

// blockChain api
// Mine a new block
blockChainRouter.post('/mine/block', multer.fields(mineBlockOptions), async(req, res, next) =>{
    console.log("api: mine block");
    const { ChainId, MinerAddr } = req.body;
    // Find prevHash and prev Height
    const cb1 = async (err, prevInfo) =>{
        if(err){
            console.log(`find prev block error: ${err}`);
            res.status(200).json(apiMsg.blockReadUnSuccessfully);
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

    await blockModel.find({ChainId: ChainId})
            .sort({height: -1})
            .select("height Hash")
            .exec(cb1);
});

// Add a new Transaction
blockChainRouter.post('/add/transaction', multer.fields(transactionAddOptions), async(req, res, next) =>{
    console.log('api: add transaction');
    const { ChainId, FromAddr, ToAddr, amount } = req.body;

    const cb1 = (err, blocks)=>{
        if(err){
            console.log(`Find blocks error: ${err}`);
            res.status(200).json(apiMsg.blockReadUnSuccessfully);
        }
        const newTx = new Transaction(ChainId, FromAddr, ToAddr, parseInt(amount));
        let trasactionMsg = blockChain.addTransaction(newTx, blocks);
        if(trasactionMsg == "Balance_of_the_sender_is_not_enough"){
            res.status(200).json(apiMsg.transactionAddedUnSuccessfully);
        }
        else if(trasactionMsg == "transaction_invalid"){
            res.status(200).json(apiMsg.transactionAddedUnSuccessfully);
        }
        else{
            res.status(200).json(apiMsg.transactionAddedSuccessfully);

        }
    };

    await blockModel.find({ChainId: ChainId})
    .exec(cb1);
});

// Get the balance of a given account
blockChainRouter.get('/read/balance', multer.fields(getBalanceOptions), async (req, res, next)=>{
    console.log('api: read balance');
    const { ChainId, accountAddr } = req.body
    const cb1 = (err, blocks) =>{
        if(err){
            console.log(`Find blocks error: ${err}`);
            res.status(200).json(apiMsg.blockReadUnSuccessfully);
        }
        else{
            let balance = getBalanceOfAddr(blocks, blockChain.pendingTransactions, accountAddr);
            res.status(200).json({balance: balance});
        } 
    };

    await blockModel.find({ChainId: ChainId})
    .exec(cb1);
});

// Read pending transactions

blockChainRouter.get('/read/pending', multer.fields(getPendingOptions),  (req, res, next)=>{
    console.log('api: read pending transactions');
    const { ChainId } = req.body
    let pendings = blockChain.pendingTransactions.filter( (transaction)=> (transaction.ChainId == ChainId));
    res.status(200).json({pendingTransactions: pendings});
});

blockChainRouter.get('/read/pending_from', multer.fields(getPendingFromAddr),  (req, res, next)=>{
    console.log('api: read pending transactions from addr');
    const { ChainId, FromAddr } = req.body
    let pendings = blockChain.pendingTransactions.filter( (transaction)=> ( (transaction.ChainId == ChainId) && (transaction.FromAddr == FromAddr) ) );
    res.status(200).json({pendingTransactions: pendings});
});

blockChainRouter.get('/read/pending_to', multer.fields(getPendingToAddr),  (req, res, next)=>{
    console.log('api: read pending transactions to addr');
    const { ChainId, ToAddr } = req.body
    let pendings = blockChain.pendingTransactions.filter( (transaction)=> ( (transaction.ChainId == ChainId) && (transaction.ToAddr == ToAddr) ) );
    res.status(200).json({pendingTransactions: pendings});
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
        console.log("read block successfully");
        res.status(200).json(block);
    });
});

// Read a chain
blockChainRouter.get('/read/chain', multer.fields(blockChainReadOptions), async (req, res, next)=>{
    console.log('api: read chain');
    const { ChainId } = req.body
    // Find chain given its ChainId(GenesisHash)
    const cb1 = (err, blocks) =>{
        if(err){
            console.log(`read chain err: ${err}`);
            res.status(200).json({apiMsg: apiMsg.blockReadUnSuccessfully});
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