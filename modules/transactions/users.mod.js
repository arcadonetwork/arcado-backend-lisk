const transactions = require('@liskhq/lisk-transactions');
const { APIClient } = require('@liskhq/lisk-api-client');
const config = require('../../config')

const api = new APIClient([config.liskAPI]);

const createUser = async (address) => {
    let tx = new transactions.TransferTransaction({
        amount: '100000000',
        recipientId: address
    });

    tx.sign(config.genesis);

    return api.transactions.broadcast(tx.toJSON())
}

module.exports = {
    createUser
}