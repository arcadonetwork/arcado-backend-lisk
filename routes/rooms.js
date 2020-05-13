const { generateUUID } = require('../modules/uuid.mod')
const { doesGameExist } = require('../modules/games.mod')
const { verifyDistribution, addRoom, doesRoomExist, joinRoom, getRoom } = require('../modules/rooms.mod')
const { sendCreateRoomTransaction } = require('../modules/transactions-helpers/create-room.mod')
const routes = require('express').Router();

/**
 * Create new game room
 * Creator of game room joins by default this room and pays the entryFee
 *
 * Body: { gameId: string, address, entryFee: number, maxPlayers: number, distribution: { first: number, second: number, third: number } }
 * Return: { id }
 */
routes.post('/create', async (req, res) => {
    const { gameId, entryFee, address, maxPlayers, distribution, passphrase } = req.body;

    if (!doesGameExist(gameId)) return res.json({ msg: 'Game not found', error: true, status: 200 })
    if (!verifyDistribution(distribution)) return res.json({ msg: 'Distribution is incorrect', error: true, status: 200 })
    if (entryFee <= 0) return res.json({ msg: 'Entry fee should be higher than 0', error: true, status: 200 })
    // check format address

    // Extra checks needed: 1. Check if every user that creates the room has sufficient balance to pay for entryFee
    // by default this user will join the new room
    const roomId = generateUUID();

    await sendCreateRoomTransaction({
        gameId, entryFee, address, maxPlayers, distribution
    }, passphrase)
    
    const room = addRoom(roomId, address, entryFee, maxPlayers, distribution)
    return res.json({ room });
})

/**
 * Join existing game room
 *
 * Body: { roomId, address }
 * Return: { success: boolean, room: Object { addresses, entryFee, maxPlayers, distribution } }
 */
routes.post('/join', (req, res) => {
    const { roomId, address } = req.body;

    if (!doesRoomExist(roomId)) return res.json({ msg: 'Room not found', error: true, status: 200 })
    
    // check if tokens can be locked for this user and join room
    
    const room = joinRoom(roomId, address)
    return res.json({ success: true, room });
})

/**
 * Retrieve single room
 * Param: id (roomId)
 * Return: { room: Object }
 */
routes.get('/:id', (req, res) => {
    const roomId = req.params.id;
    const room = getRoom(roomId)

    if (!room) {
        return res.json({ msg: 'Room not found', error: true, status: 200 })
    }

    return res.json({ room });
})


module.exports = routes;