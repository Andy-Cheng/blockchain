/**
 * @file Manages routings and api designs.
 */
const blockChainRouter = require('express').Router();
const multer  = require('multer')();
const { blockModel } = require('./mongoose-db');
const apiMsg = require('./apiMsg');
const { blockReadOptions, blockAddOptions, blockChainReadOptions } = require('./multerOption');

//testing data
let hash = "baa744f2bd8dd2afd98e13de0c3056cf70faef7635efb265d96ffe4d2736cdf4";
let genesisHash = "93bfd81989ed6feff36abe0228878d62298fd6ffa6ec92e2c3abb4744b4edc5c";


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
    })
});
// Add a new block
blockChainRouter.post('/add/block', multer.fields(blockAddOptions), async(req, res, next) =>{
    console.log('api: add block');
    const { ChainId, Transcations } = req.body;
    console.log(`ChainId: ${ChainId},\nTranscations: ${Transcations}`)
    // Find prevHash and prev Height
    const cb1 = async (err, prevInfo) =>{
        if(err){
            console.log(`find prev block error: ${err}`);
            res.status(200).json("find prevBlock failed");
        }
        else{
            console.log(`prevInfo ${typeof(prevInfo)}`)
            let newBlock = {};
            //Genesis Block
            if(prevInfo.length == 0){
                console.log("Chain is still empty")
                newBlock = {
                        ChainId: ChainId,
                        height: 1,
                        prevBlockHash: "none",
                        Time: new Date(),
                        Bits: 20,
                        Transcations: Transcations,
                        Hash: ChainId,
                        Nonce: 0,
                    };
            }
            // To do: add POW mechanism here.
            //Normal Block
            else{
                console.log("Chain is not empty");
                newBlock = {
                    ChainId: ChainId,
                    height: prevInfo[0].height + 1,
                    prevBlockHash: prevInfo[0].Hash,
                    Time: new Date(),
                    Bits: 20,
                    Transcations: Transcations,
                    Hash: hash,
                    Nonce: 0,
                };
            }
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