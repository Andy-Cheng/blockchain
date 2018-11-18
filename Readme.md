# Blockchain
## Resources
- Crypto
    - https://www.cnblogs.com/chyingp/p/nodejs-learning-crypto-theory.html
- DB
    - https://hackmd.io/R9eFxCZJSya17gzmbK2QFQ?view
    - https://mongoosejs.com/docs/schematypes.html#arrays
    - https://blog.csdn.net/WHUZXQ/article/details/74987530
- Frontend
    - ReactJS
- Backend
    - NodeJS

## Todo 
### BlockChain
- UTXO transcation Model (util.js)
### Backend
- main part: apiMsg.js, apiRouter.js
- start part: index.js
- Add npm run scripts
### Frontend

## usage
**This usage is for Unix-like OS.**
- make sure you have installed mongoDB
- make a local db path by mkdir <YOUR DB PATH>
- start up locally: 
    - method1
    1. export DBPATH=<YOUR DB PATH>, note there're no spaces beside =
    2. npm install
    3. npm run dev
    - method2
    1. export DBPATH=<YOUR DB PATH>
    2. In one window of the terminal, npm run startdblocally
    3. In another window of the terminal, npm start

## Design Concept
### API
Api designs follow Restful API.
For more details, please take a look at **apiRouter.js**.
### DB
MongoDB is a NoSql DB. NoSql DB prevails at handling unstructured data.
Due to its more relax structure than Sql DB, it's useful in storing  unstructured big data, and thus can be adapted to storing properties of webforms and their components and be scalabe.
#### Schema
Mongoose is a handy MongoDB Js driver.
A schema is a definition of one collection, which define the shape of included documents.
A model is a instance of a schema can be manipulated by DB operation.
For more details, please refer to **mongoose-db.js**