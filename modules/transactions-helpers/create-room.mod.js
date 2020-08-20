const { APIClient } = require('@liskhq/lisk-api-client');
const CreateRoomTransaction = require('../transactions/create-room')
const transactions = require('@liskhq/lisk-transactions');
const config = require('../../config')

const api = new APIClient([config.liskAPI]);

const sendCreateRoomTransaction = async ({ name, roomId, gameId, entryFee, address, distribution, maxPlayers }, passphrase) => {
    let tx = new CreateRoomTransaction({
        asset: {
            roomId,
            name,
            gameId,
            entryFee,
            distribution,
            maxPlayers,
            address,
            recipientId: address
        },
        networkIdentifier: config.NETWORK_IDENTIFIER,
        timestamp: transactions.utils.getTimeFromBlockchainEpoch(Number(new Date()) - 10000)
    });

    tx.sign(passphrase);

    return api.transactions.broadcast(tx.toJSON());
}

module.exports = {
    sendCreateRoomTransaction
}
