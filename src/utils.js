const { maxNonce } = require('./constant');
const crypto = require('crypto');

class Block{
    /**
     * 
     * @param {Number} height 
     * @param {String} prevBlockHash 
     * @param {Date} Time 
     * @param {Number} Bits 
     * @param {string} Transcations 
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
}



class BlockChain{
    constructor(){
        this.blocks = [];
        this.blocks.push(BlockChain.NewGenesisBlock());
    }

    static NewGenesisBlock() {
        return BlockChain.NewBlock("區塊鏈gogog!", "創世區塊prevhash", 0);
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

    addBlock(transcations){
        const { blocks } = this;
        prevBlock = blocks[blocks.length() - 1];
        newBlock = BlockChain.NewBlock(transcations, prevBlock.Hash(), blocks.length());
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
        return (height + prevBlockHash + Time.getTime() + Bits + Transcations + nonce);
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
};