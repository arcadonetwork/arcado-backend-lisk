const config = require('./config')

const express = require('express')
const app = express();

app.get('/', (_, res) => {
  res.send('API up and running')
});

app.listen(config.port, () => {
  console.log(`Arcado network running at port ${config.port}`)
});