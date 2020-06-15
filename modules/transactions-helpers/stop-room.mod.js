const { APIClient } = require('@liskhq/lisk-api-client');
const StopRoomTransaction = require('../transactions/stop-room')
const config = require('../../config')

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
        }
    });

    tx.sign(passphrase);

    return api.transactions.broadcast(tx.toJSON())
}

module.exports = {
    sendStopRoomTransaction
}
