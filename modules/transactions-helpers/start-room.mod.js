const { APIClient } = require('@liskhq/lisk-api-client');
const StartRoomTransaction = require('../transactions/start-room')
const config = require('../../config')
const transactions = require('@liskhq/lisk-transactions');

const api = new APIClient([config.liskAPI]);

const sendStartRoomTransaction = async ({ roomId, address }, passphrase) => {
    let tx = new StartRoomTransaction({
        recipientId: address,
        asset: {
            roomId,
            address
        },
        networkIdentifier: config.NETWORK_IDENTIFIER,
        timestamp: transactions.utils.getTimeFromBlockchainEpoch(Number(new Date()) - 10000)
    });

    tx.sign(passphrase);

    return api.transactions.broadcast(tx.toJSON())
}

module.exports = {
    sendStartRoomTransaction
}
