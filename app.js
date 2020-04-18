const config = require('./config')
const routes = require('./routes');

// https://www.npmjs.com/package/http-errors
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', routes.auth)
app.use('/games', routes.games)
app.use('/rooms', routes.rooms)

app.get('/', (_, res) => {
  res.send('API up and running')
});

app.listen(config.port, () => {
  console.log(`Arcado network running at port ${config.port}`)
});