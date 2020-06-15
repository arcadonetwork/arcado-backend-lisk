const { generateUUID } = require('../modules/uuid.mod')
const { doesGameExist } = require('../modules/games.mod')
const { verifyDistribution, addRoom, doesRoomExist, joinRoom, getRoom, getRoomsByGameId } = require('../modules/rooms.mod')
const { sendCreateRoomTransaction } = require('../modules/transactions-helpers/create-room.mod')
const { sendJoinRoomTransaction } = require('../modules/transactions-helpers/join-room.mod')
const { sendStartRoomTransaction } = require('../modules/transactions-helpers/start-room.mod')
const { sendStopRoomTransaction } = require('../modules/transactions-helpers/stop-room.mod')

const routes = require('express').Router({ mergeParams: true });

/**
 * Retrieve a list of rooms that belong to a game
 * Param: id (gameId)
 * Return: { rooms: Array }
 */
routes.get('/', (req, res) => {
    const gameId = req.params.gameId;
    const rooms = getRoomsByGameId(gameId)
    return res.json({ rooms });
})

/**
 * Create new game room
 * Creator of game room joins by default this room and pays the entryFee
 *
 * Body: { name: string, gameId: string, address, entryFee: number, maxPlayers: number, distribution: { first: number, second: number, third: number } }
 * Return: { id }
 */
routes.post('/', async (req, res) => {
    const gameId = req.params.gameId;
    const { name, entryFee, address, maxPlayers, distribution, passphrase } = req.body;
    distribution.first = Number(distribution.first);
    distribution.second = Number(distribution.second);
    distribution.third = Number(distribution.third);

    if (!doesGameExist(gameId)) return res.json({ msg: 'Game not found', error: true, status: 200 })
    if (!verifyDistribution(distribution)) return res.json({ msg: 'Distribution is incorrect', error: true, status: 200 })
    if (entryFee <= 0) return res.json({ msg: 'Entry fee should be higher than 0', error: true, status: 200 })
    // check format address

    // Extra checks needed: 1. Check if every user that creates the room has sufficient balance to pay for entryFee
    // by default this user will join the new room
    const roomId = generateUUID();

    await sendCreateRoomTransaction({
        name, roomId, gameId, entryFee, address, maxPlayers, distribution // room ID ook op blockchain!
    }, passphrase)

    const room = addRoom(gameId, roomId, name, address, entryFee, maxPlayers, distribution)
    return res.json({ room });
})

/**
 * Join existing game room
 *
 * Query param: $id = roomId
 * Body: { address, passphrase }
 * Return: { success: boolean, room: Object { addresses, entryFee, maxPlayers, distribution } }
 */
routes.post('/:id/join', async (req, res) => {
    const roomId = req.params.id;
    const { address, passphrase } = req.body;

    if (!doesRoomExist(roomId)) return res.json({ msg: 'Room not found', error: true, status: 200 })

    // check if tokens can be locked for this user and join room
    await sendJoinRoomTransaction({
        roomId, address // not game but room
    }, passphrase)

    const room = joinRoom(roomId, address)
    return res.json({ success: true, room });
})

/**
 * Start existing game room
 *
 * Body: { roomId, address }
 * Return: { success: boolean, room: Object { addresses, entryFee, maxPlayers, distribution } }
 */
routes.post('/:id/start', async (req, res) => {
    const roomId = req.params.id;
    const { address, passphrase } = req.body;

    try {
        await sendStartRoomTransaction({
            roomId, address
        }, passphrase)
    } catch (error) {
        return res.json({ msg: 'You are not the owner of the room', error: true, status: 200 })
    }

    return res.json({ success: true });
})

/**
 * Stop existing game room and payout the distribution
 *
 * Body: { roomId, address }
 * Return: { success: boolean, room: Object { addresses, entryFee, maxPlayers, distribution } }
 */
routes.post('/:id/stop', async (req, res) => {
    const roomId = req.params.id;
    const { first, second, third, address, passphrase } = req.body; // Addresses of winners

    try {
        await sendStopRoomTransaction({
            roomId, address, first, second, third
        }, passphrase)
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'You are not the owner of the room', error: true, status: 200 })
    }

    return res.json({ success: true });
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
