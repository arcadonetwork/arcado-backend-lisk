const { generateUUID } = require('../modules/uuid.mod')

const routes = require('express').Router();

/**
 * Create new game room
 * Body: { gameId: string, entryFee: number, maxPlayers: number, distribution: { first: number, second: number, third: number } }
 * Return: { id }
 */
routes.post('/create', (req, res) => {
    const { gameId, entryFee, maxPlayers, distribution: { first, second, third }} = req.body;

    // Extra checks needed: 1. Check if every user has sufficient balance to pay for entryFee
    const roomId = generateUUID();
    return res.json({ id: roomId });
})

module.exports = routes;