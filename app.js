const config = require('./config')
const routes = require('./routes');

const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use('/accounts', routes.accounts)
app.use('/games', routes.games)
app.use('/games/:gameId/rooms', routes.rooms)

app.get('/', (_, res) => {
  res.send('API up and running')
});

app.listen(config.port, () => {
  console.log(`Arcado network running at port ${config.port}`)
});
