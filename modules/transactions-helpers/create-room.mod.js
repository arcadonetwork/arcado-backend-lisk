const { APIClient } = require('@liskhq/lisk-api-client');
const CreateRoomTransaction = require('../transactions/create-room')
const config = require('../../config')

const api = new APIClient([config.liskAPI]);

const sendCreateRoomTransaction = async ({ gameId, entryFee, address, distribution, maxPlayers }, passphrase) => {
    let tx = new CreateRoomTransaction({
        recipientId: address,
        asset: {
            gameId,
            entryFee,
            distribution,
            maxPlayers,
            address
        }
    });

    tx.sign(passphrase);

    return api.transactions.broadcast(tx.toJSON())
}

module.exports = {
    sendCreateRoomTransaction
}
