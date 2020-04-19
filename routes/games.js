const routes = require('express').Router();

/* Hardcoded list of supported games */
const games = [
    { id: 'CSGO', name: 'Counter Strike Global Offensive' },
    { id: 'LOL', name: 'League of Legends' },
    { id: 'GTA5', name: 'Grand Theft Auto V' },
    { id: 'PUBG', name: 'PlayerUnknowns Battlegrounds' },
    { id: 'FOR', name: 'Fortnite' }
];

/**
 * Retrieve all supported games
 * Param: /
 * Return: { games: [ { name, id }] }
 */
routes.get('/', (_, res) => {
    return res.json({ games });
})

module.exports = routes;