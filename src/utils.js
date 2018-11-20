const { maxNonce } = require('./constant');
const crypto = require('crypto');

class Block{
    /**
     * 
     * @param {Number} height 
     * @param {String} prevBlockHash 
     * @param {Date} Time 
     * @param {Number} Bits 
     * @param {Array} Transcations
     * Transactions is an array of class Transaction
     */
    constructor(height, prevBlockHash, Time, Bits, Transcations){
        this.height = height;
        this.prevBlockHash = prevBlockHash;
        this.Time = Time;
        this.Bits = Bits;
        this.Transcations = Transcations;
    }

    setHash(){
        const pow = new Pow(this);
        const {nonce, hash} = pow.Run();
        this.Hash = hash;
        this.nonce = nonce;
    }
    /*
    hashTX(){
        return calculateHash(this.Transcations);
    }
    */
}



class BlockChain{
    constructor(){
        this.blocks = [];
        this.blocks.push(BlockChain.NewGenesisBlock());
        this.pendingTransactions = [];
        this.miningReaward  = 100;
    }

    static NewGenesisBlock(transcations) {
        
        return BlockChain.NewBlock(transcations, "創世區塊prevhash", 0);
    }

    /**
     * 
     * @param {string} transcations
     * @param {string} prevBlockHash 
     * @param {Number} prevheight 
     */
    static NewBlock(transcations, prevBlockHash, prevheight){
        const newBlock = new Block(
            prevheight + 1,
            prevBlockHash, 
            new Date(),
            8,
            transcations,
        );
        newBlock.setHash();
        return newBlock;
    
    };
    // Mine a new block and send a reward by sending a new Transaction.
    minePendingTransaction(miningRewardAddr){
        const { blocks } = this;
        prevBlock = blocks[blocks.length() - 1];
        let newBlock = BlockChain.NewBlock(this.pendingTransactions[this.pendingTransactions.length -1 ], prevBlock.Hash(), blocks.length());
        this.blocks.push(newBlock);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddr,  this.miningReaward)
        ];
        
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }
    
    getBalanceOfAddr(addr){
        let balalnce = 0;
        this.blocks.map((block, heightMinusOne)=>{
            block.transcations.map((transaction) =>{
                if(transaction.FromAddr == addr){
                    balance -= transaction.amount;
                }
                else if(transaction.ToAddr == addr){
                    balance += transaction.amount;
                }
            });
        });
        return balalnce;
    }

    addBlock(transcations){
        const { blocks } = this;
        prevBlock = blocks[blocks.length() - 1];
        let newBlock = BlockChain.NewBlock(transcations, prevBlock.Hash(), blocks.length());
        this.blocks.push(newBlock);
    }
}

// We use sha256 to hash transcations, and represent the result as a hex string.
// Note: cipher.update(String, encoding) will update the content to be hashed. 
// cipher.update() can't be called after cipher.digest() is called.
const calculateHash = (data) =>{
    const cipher = crypto.createHash('sha256');
    cipher.update(data, 'utf8');         

    return cipher.digest('hex');
};

class Pow{
    constructor(block){
        this.block = block;
        const{ Bits } = block;
        // Set Target. Target menas the number larger than maximum possible solution by 1 bit.
        // Diffulty is Bits / 4.
        this.diffulty = Bits / 4;
        this._target = Array(this.diffulty + 1).join("0");
    }
    prepareData(nonce){
        const {height, prevBlockHash, Time, Bits, Transcations} = this.block;
        let dataToBeHashed = (height + prevBlockHash + Time.getTime() + Bits + nonce);
        Transcations.map( (transaction)=> {
            const { FromAddr, ToAddr, amount } = transaction;
            dataToBeHashed += FromAddr + ToAddr + amount;
        });
        return dataToBeHashed;
    }
    // We aim to find (nonce, hash) to fulfill the inequality of POW.
    Run(){
        const {_target} = this;
        // Try nonce form 0 to maxNonce
        let nonce = 0;
        let hash = "";
        for(; nonce < maxNonce; ++nonce){
            let data = this.prepareData(nonce);
            hash = calculateHash(data);
            console.log(`hash: ${hash}`);
            // console.log(`target: ${_target}`)
            if( hash.substring(0, this.diffulty) === _target){
                break;
            }
            else{
                ++nonce;
            }
        }        
        return {nonce, hash};
    }
    Validate(){

    }
}

module.exports = {
    Block,
    BlockChain, 
    Pow,
    Transaction,
};
/*
class TXInput{
    constructor(Txid, Vout, ScriptSig){
        this.Txid = Txid;
        this.Vout = Vout;
        this.ScriptSig = ScriptSig;
    }
}
*/
class Transaction{
    constructor(FromAddr, ToAddr, amount){
        this.FromAddr = FromAddr;
        this.ToAddr = ToAddr;
        this.amount = amount;
    }
}
/*
class TXOutput{
    constructor(Value, ScriptPubKey){
        this.Value = Value;
        this.ScriptPubKey = ScriptPubKey;
    }
}
*/
