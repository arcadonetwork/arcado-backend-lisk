const { APIClient } = require('@liskhq/lisk-api-client');
const JoinRoomTransaction = require('../transactions/join-room')
const config = require('../../config')
const transactions = require('@liskhq/lisk-transactions');

const api = new APIClient([config.liskAPI]);

const sendJoinRoomTransaction = async ({ roomId, address, gameId }, passphrase) => {
    let tx = new JoinRoomTransaction({
        recipientId: address,
        asset: {
            gameId,
            roomId,
            address
        },
        networkIdentifier: config.NETWORK_IDENTIFIER,
        timestamp: transactions.utils.getTimeFromBlockchainEpoch(Number(new Date()) - 10000)
    });

    tx.sign(passphrase);
    return api.transactions.broadcast(tx.toJSON());
}

module.exports = {
    sendJoinRoomTransaction
}
