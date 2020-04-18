const authRoutes = require('./auth');
const gamesRoutes = require('./games');
const roomsRoutes = require('./rooms');

module.exports = {
    auth: authRoutes,
    games: gamesRoutes,
    rooms: roomsRoutes
};
