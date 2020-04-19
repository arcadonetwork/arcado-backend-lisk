// In-mem DB for [ { id, addresses: [ string ], entryFee, maxPlayers, distribution } ]
let roomsDB = [];

const getAllRooms = () => (roomsDB)

const getRoom = id => roomsDB.find(room => room.id === id)

const addRoom = (id, address, entryFee, maxPlayers, distribution) => {
    roomsDB.push({
        id,
        addresses: [ address ],
        entryFee,
        maxPlayers,
        distribution
    })
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
    return ((first + second + third) !== 100) 
        ? false
        : true
}

module.exports = {
    verifyDistribution,
    getAllRooms,
    getRoom,
    addRoom,
    doesRoomExist,
    joinRoom
}