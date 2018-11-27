
const multerOptions = {
    blockReadOptions :[{name: "ChainId", maxCount: 1}, {name: "height", maxCount: 1} ],
    blockChainReadOptions: [{name: "ChainId", maxCount: 1}],
    mineBlockOptions: [{name: "ChainId", maxCount: 1}, {name: "MinerAddr", maxCount: 1}],
    transactionAddOptions: [{name: "ChainId", maxCount: 1}, {name: "FromAddr", maxCount: 1}, {name: "ToAddr", maxCount: 1}, {name: "amount", maxCount: 1}],
    getBalanceOptions: [{name: "ChainId", maxCount: 1}, {name: "accountAddr", maxCount: 1}],
    getPendingOptions:[{name: "ChainId", maxCount: 1}],
    getPendingFromAddr: [{name: "ChainId", maxCount: 1}, {name: "FromAddr", maxCount: 1}],
    getPendingToAddr: [{name: "ChainId", maxCount: 1}, {name: "ToAddr", maxCount: 1}]
};

module.exports = multerOptions;
