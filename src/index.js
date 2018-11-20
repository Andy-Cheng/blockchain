const express = require('express');
const app = express()
const http = require('http');
const server = http.createServer(app)

const { blockChainRouter } = require('./apiRouter');
app.use('/api', blockChainRouter);


const port = 8080||process.env.Port;
const blockChain = new BlockChain();

server.listen(port, ()=>{console.log(`listening to port ${port}`)});
