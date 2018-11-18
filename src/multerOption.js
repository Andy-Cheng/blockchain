const multerLibrary  = require('multer');
const multer = multerLibrary();

const multerOptions = {
    multer, 
    blockReadOptions :[{name: "ChainId", maxCount: 1}, {name: "height", maxCount: 1} ],
    blockAddOptions :[{name: "ChainId", maxCount: 1}, {name: "Transactions", maxCount: 1}  ],
    blockChainReadOptions: [{name: "ChainId", maxCount: 1}],
};

export default multerOptions;
