
const multerOptions = {
    blockReadOptions :[{name: "ChainId", maxCount: 1}, {name: "height", maxCount: 1} ],
    blockAddOptions :[{name: "ChainId", maxCount: 1}, {name: "Transcations", maxCount: 1}  ],
    blockChainReadOptions: [{name: "ChainId", maxCount: 1}],
    mineBlockOptions: [{name: "ChainId", maxCount: 1}, {name: "MinerAddr", maxCount: 1}],
    transactionAddOptions: [{name: "FromAddr", maxCount: 1}, {name: "ToAddr", maxCount: 1}, {name: "amount", maxCount: 1}],
};

module.exports = multerOptions;
