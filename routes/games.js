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

module.exports = routes;