const { APIClient } = require('@liskhq/lisk-api-client');
const JoinRoomTransaction = require('../transactions/join-room')
const config = require('../../config')

const api = new APIClient([config.liskAPI]);

const sendJoinRoomTransaction = async ({ roomId, address }, passphrase) => {
    let tx = new JoinRoomTransaction({
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
    sendJoinRoomTransaction
}
