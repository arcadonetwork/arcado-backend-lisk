const config = require('./config')
// https://www.npmjs.com/package/http-errors

const express = require('express')
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.get('/', (_, res) => {
  res.send('API up and running')
});

app.listen(config.port, () => {
  console.log(`Arcado network running at port ${config.port}`)
});