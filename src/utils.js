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
        // pendingTransactions is an array of transaction Object.
        this.pendingTransactions = [];
        this.miningReaward  = 100;
    }

    /**
     * 
     * @param {Array} transcation
     * transaction is an transaction class
     */
    static NewGenesisBlock(transcation) {
        return BlockChain.NewBlock([transcation], "創世區塊prevhash", 0);
    }

    /**
     * 
     * @param {Array} transcations
     * @param {string} prevBlockHash 
     * @param {Number} prevheight 
     * transactions is an array of transaction class
     * 
     */
    static NewBlock(transcations, prevBlockHash, prevheight){
        const newBlock = new Block(
            prevheight + 1,
            prevBlockHash, 
            new Date(),
            4,
            transcations,
        );
        newBlock.setHash();
        return newBlock;
    
    };
    // Mine a new block and send a reward by sending a new Transaction.
    minePendingTransaction(miningRewardAddr){
        const { blocks } = this;
        const minerTransaction = new Transaction("mining reward", miningRewardAddr, this.miningReaward);
        let newBlock;
        if (blocks.length == 0){
            newBlock = BlockChain.NewGenesisBlock(minerTransaction);
        }
        else{
            this.pendingTransactions.push(minerTransaction);
            let prevBlock = blocks[blocks.length - 1];
            newBlock = BlockChain.NewBlock(this.pendingTransactions, prevBlock.Hash, prevBlock.height);
        }
        this.blocks.push(newBlock);
        this.pendingTransactions = [];
    }


    createTransaction(FromAddr, ToAddr, amount){
        // console.log(`this: ${this.blocks[0]}`)
        let senderBalance = getBalanceOfAddr(this.blocks, this.pendingTransactions, FromAddr);
        console.log(`Sender's balance: ${senderBalance}, amount to be sent: ${amount}`);
        if( senderBalance < amount ){
            return "Balance_of_the_sender_is_not_enough"
        }
        this.pendingTransactions.push(new Transaction(FromAddr, ToAddr, amount));
        return "Transaction_is_approved"
    }

}


const getBalanceOfAddr = (blocks, pendingTransactions, addr) =>{
    // console.log(`get blocks: ${blocks[0].Transcations[0].amount}`)
    let balance = 0;
    blocks.map( (block) =>{
        block.Transcations.map((transaction) =>{
            if(transaction.FromAddr == addr){
                balance -= transaction.amount;
            }
            else if(transaction.ToAddr == addr){
                balance += transaction.amount;
            }
        });
    });
    pendingTransactions.map( (transaction) =>{
        if(transaction.FromAddr == addr){
            balance -= transaction.amount;
        }
        else if(transaction.ToAddr == addr){
            balance += transaction.amount;
        }
    });
    return balance;
};

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
        console.log("Start mining...")
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
        console.log("Mining is done !")
        return {nonce, hash};
    }
    Validate(){

    }
}


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

module.exports = {
    Block,
    BlockChain, 
    Pow,
    Transaction,
    getBalanceOfAddr
};
