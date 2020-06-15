const { APIClient } = require('@liskhq/lisk-api-client');
const StartRoomTransaction = require('../transactions/start-room')
const config = require('../../config')

const api = new APIClient([config.liskAPI]);

const sendStartRoomTransaction = async ({ roomId, address }, passphrase) => {
    let tx = new StartRoomTransaction({
        recipientId: address,
        asset: {
            roomId,
            address
        }
    });

    tx.sign(passphrase);

    return api.transactions.broadcast(tx.toJSON())
}

module.exports = {
    sendStartRoomTransaction
}
