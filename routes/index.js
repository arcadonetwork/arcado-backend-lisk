const usersRoutes = require('./users');
const gamesRoutes = require('./games');
const roomsRoutes = require('./rooms');

module.exports = {
    users: usersRoutes,
    games: gamesRoutes,
    rooms: roomsRoutes
};
