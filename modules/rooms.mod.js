// In-mem DB for [ { id, name, addresses: [ string ], entryFee, maxPlayers, distribution, status } ]
// room.status ENUM (0: "not started", 1: "started", 2: "ended")
let roomsDB = [];

const getAllRooms = () => (roomsDB)

const getRoom = id => roomsDB.find(room => room.id === id)
const getRoomsByGameId = id => roomsDB.filter(room => room.gameId === id)

/**
 * @return {Object} room with status and participating addresses
 */
const addRoom = (gameId, id, name, address, entryFee, maxPlayers, distribution) => {
    const room = {
        id,
        gameId,
        name,
        addresses: [ address ],
        entryFee,
        maxPlayers,
        distribution,
        status: 0,
        createdBy: address
    };
    roomsDB.push(room)
    return room
}

const startRoom = id => {
    const roomIndex = roomsDB.findIndex(room => room.id === id)
    roomsDB[roomIndex].status = 1;
    return roomsDB[roomIndex]
}

const endRoom = (id, first, second, third) => {
    const roomIndex = roomsDB.findIndex(room => room.id === id)
    roomsDB[roomIndex].status = 2;
    roomsDB[roomIndex].endResult = {
        first, second, third
    };
    return roomsDB[roomIndex]
}

const roomStatusToText = status => {
    switch (status) {
        case 0:
            return "not started"
        case 1:
            return "started"
        case 2:
            return "ended"
    }
}

const joinRoom = (id, address) => {
    const roomIndex = roomsDB.findIndex(room => room.id === id)
    roomsDB[roomIndex].addresses.push(address)
    return roomsDB[roomIndex]
}

/**
 * Verify if room exists
 * @param {string} roomId e.g. 10aliy85
 * @return {boolean}
 */
const doesRoomExist = roomId =>
    roomsDB.find(room => room.id === roomId)
        ? true
        : false

/**
 * Sum of distribution must be = 100
 * @param {Object} distribution
 * @param {number} distribution.first
 * @param {number} distribution.second
 * @param {number} distribution.third
 */
const verifyDistribution = distribution => {
    const { first, second, third } = distribution;
    return ((first + second + third) === 100)
}

module.exports = {
    verifyDistribution,
    getAllRooms,
    getRoom,
    getRoomsByGameId,
    addRoom,
    doesRoomExist,
    joinRoom,
    startRoom,
    endRoom,
    roomStatusToText
}
