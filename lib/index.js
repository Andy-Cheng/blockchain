"use strict";

const express = require('express');

const app = express();

const http = require('http');

const server = http.createServer(app);

const {
  blockChainRouter
} = require('./appRouter');

app.use('/api/blockchain', blockChainRouter);
const port = 8080 || process.env.Port;
server.listen(port, () => {
  console.log(`listening to port ${port}`);
});