const accountsRoutes = require('./accounts');
const gamesRoutes = require('./games');
const roomsRoutes = require('./rooms');

module.exports = {
    accounts: accountsRoutes,
    games: gamesRoutes,
    rooms: roomsRoutes
};
