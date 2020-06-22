const transactions = require('@liskhq/lisk-transactions');
const { APIClient } = require('@liskhq/lisk-api-client');
const config = require('../../config')

const api = new APIClient([config.liskAPI]);

const createUser = async (address) => {
    let tx = new transactions.TransferTransaction({
        amount: '10000000000',
        recipientId: address
    });

    tx.sign(config.genesis);

    return api.transactions.broadcast(tx.toJSON())
}

const getAccount = async (address) => {
    const accounts = await api.accounts.get({ address }).then(({ data }) => data);
    return accounts && accounts.length > 0 ? accounts[0] : undefined;
}

module.exports = {
    createUser,
    getAccount
}
