
const multerOptions = {
    blockReadOptions :[{name: "ChainId", maxCount: 1}, {name: "height", maxCount: 1} ],
    blockAddOptions :[{name: "ChainId", maxCount: 1}, {name: "Transcations", maxCount: 1}  ],
    blockChainReadOptions: [{name: "ChainId", maxCount: 1}],
};

module.exports = multerOptions;
