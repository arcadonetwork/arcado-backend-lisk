const { generateUUID } = require('../modules/uuid.mod')
const { doesGameExist } = require('../modules/games.mod')
const { verifyDistribution } = require('../modules/rooms.mod')

const routes = require('express').Router();

/**
 * Create new game room
 * Body: { gameId: string, entryFee: number, maxPlayers: number, distribution: { first: number, second: number, third: number } }
 * Return: { id }
 */
routes.post('/create', (req, res) => {
    const { gameId, entryFee, maxPlayers, distribution } = req.body;

    if (!doesGameExist(gameId)) return res.json({ msg: 'Game not found', error: true, status: 200 })
    if (!verifyDistribution(distribution)) return res.json({ msg: 'Distribution is incorrect', error: true, status: 200 })

    // Extra checks needed: 1. Check if every user has sufficient balance to pay for entryFee
    const roomId = generateUUID();
    return res.json({ id: roomId });
})

module.exports = routes;