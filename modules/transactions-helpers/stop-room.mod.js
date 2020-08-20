const { APIClient } = require('@liskhq/lisk-api-client');
const StopRoomTransaction = require('../transactions/stop-room')
const config = require('../../config')
const transactions = require('@liskhq/lisk-transactions');

const api = new APIClient([config.liskAPI]);

const sendStopRoomTransaction = async ({ roomId, address, first, second, third }, passphrase) => {
    let tx = new StopRoomTransaction({
        recipientId: address,
        asset: {
            roomId,
            address,
            first,
            second,
            third
        },
        networkIdentifier: config.NETWORK_IDENTIFIER,
        timestamp: transactions.utils.getTimeFromBlockchainEpoch(Number(new Date()) - 10000)
    });

    tx.sign(passphrase);

    return api.transactions.broadcast(tx.toJSON())
}

module.exports = {
    sendStopRoomTransaction
}
