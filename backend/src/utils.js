const { maxNonce } = require('./constant');
const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

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
    hasValidTx(){
        this.Transcations.map( (Tx) =>{
            if(!Tx.isVlalid()){
                return false;
            }
        });
        return true;
    }
}

class BlockChain{
    /**
     * 
     * @param {Transaction Array} pendingTransactions 
     * 
     */
    constructor(){
        this.pendingTransactions = [];
        this.miningReaward  = 100;
    }

    /**
     * 
     * @param {Array} transcation
     * transaction is an transaction class
     */
    static NewGenesisBlock(transcation) {
        return BlockChain.NewBlock([transcation], null, 0);
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
            8,
            transcations,
        );
        newBlock.setHash();
        return newBlock;
    
    };
    // Mine a new block and send a reward by sending a new Transaction.
    minePendingTransaction(ChainId, miningRewardAddr, isGenesis = false, prevInfo={}){
        const minerTransaction = new Transaction(ChainId, null, miningRewardAddr, this.miningReaward);
        let newBlock;
        if (isGenesis){
            newBlock = BlockChain.NewGenesisBlock(minerTransaction);
        }
        else{
            this.pendingTransactions.push(minerTransaction);
            newBlock = BlockChain.NewBlock(this.pendingTransactions.filter( (transaction) => (transaction.ChainId == ChainId) ), prevInfo.Hash, prevInfo.height);
        }
        this.pendingTransactions = this.pendingTransactions.filter( (transaction) => (transaction.ChainId != ChainId) );
        // Store this new block into DB.
        return newBlock;
    }


    addTransaction(transaction, blocks){
        let senderBalance = getBalanceOfAddr(blocks, this.pendingTransactions, transaction.FromAddr);
        console.log(`Sender's balance: ${senderBalance}, amount to be sent: ${transaction.amount}`);
        if( senderBalance < transaction.amount ){
            console.log("Balance_of_the_sender_is_not_enough")
            return "Balance_of_the_sender_is_not_enough";
        }
        if( !transaction.isVlalid() ){
            console.log("transaction_invalid")
            return "transaction_invalid";
        }
        this.pendingTransactions.push(transaction);
        return "Transaction_is_approved";
    }

}

const isChainValid = (blocks) => {
    for (let i = 1; i < blocks.length; ++i){
        let block = blocks[i];
        let prevBlock = blocks[ i-1 ];
        if( !block.hasValidTx() ){
            console.log("Tx in block not valid");
            return false;
        }
        if( block.hash != calculateBlockHash(block) ){
            console.log("Block hash is not consisitent");
            return false;
        }
        if( block.prevBlockHash != calculateBlockHash(prevBlock) ){
            console.log("prevblock hash is not equal to hash of prevblock.");
            return false;
        }
    }
    return true;
};

const getBalanceOfAddr = (blocks, pendingTransactions, addr) =>{
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

const calculateBlockHash = (block) =>{
    const {height, prevBlockHash, Time, Bits, Transcations, nonce} = block;
    let dataToBeHashed = (height + prevBlockHash + Time.getTime() + Bits + nonce);
    Transcations.map( (transaction)=> {
        const { ChainId, FromAddr, ToAddr, amount, Time } = transaction;
        dataToBeHashed += (ChainId + FromAddr + ToAddr + amount + Time.getTime());
    });
    return calculateHash(dataToBeHashed);
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
            const { ChainId, FromAddr, ToAddr, amount, Time } = transaction;
            dataToBeHashed += (ChainId + FromAddr + ToAddr + amount + Time.getTime());
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
            // console.log(`hash: ${hash}`);
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

class Transaction{
    constructor(ChainId, FromAddr, ToAddr, amount){
        this.ChainId = ChainId;
        this.FromAddr = FromAddr;
        this.ToAddr = ToAddr;
        this.amount = amount;
        this.Time = new Date();
    }
    
    calculateTxHash(){
        let data = this.ChainId + this.FromAddr + this.ToAddr + this.amount + this.Time.getTime();
        return calculateHash(data);
    }

    signTx(signingKey){
        if(signingKey.getPublic("hex") !== this.FromAddr){
            throw new Error("You can't sign transaction for other wallets");
        }
        const hashTX = this.calculateTxHash();
        const sig = signingKey.sign(hashTX, "base64");
        this.signature = sig.toDER("hex");
    }

    isVlalid(){
        // miner reward transaction
        if(this.FromAddr == null){
            return true;
        }
        if(!this.signature || this.signature.length == 0){
            throw new Error("No signature in this transaction.");
        }
        const publicKey = ec.keyFromPublic(this.FromAddr, "hex");
        return publicKey.verify(this.calculateTxHash(), this.signature);
    }
}

module.exports = {
    BlockChain, 
    getBalanceOfAddr,
    Transaction, 
    isChainValid
};