const { games } = require('../modules/games.mod')

const routes = require('express').Router();

/**
 * Retrieve all supported games
 * Param: /
 * Return: { games: [ { name, id }] }
 */
routes.get('/', (_, res) => {
    return res.json({ games });
})

routes.get('/:gameId', (req, res) => {
    const gameId = req.params.gameId;
    const game = games.find(item => item.id === gameId);
    return res.json({ game });
})

module.exports = routes;
