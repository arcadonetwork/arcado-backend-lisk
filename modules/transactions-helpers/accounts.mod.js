const transactions = require('@liskhq/lisk-transactions');
const { APIClient } = require('@liskhq/lisk-api-client');
const config = require('../../config')

const api = new APIClient([config.liskAPI]);

const addBalanceFromGenesis = async (address) => {
    let tx = new transactions.TransferTransaction({
        asset : {
            recipientId: address,
            amount: '1000000000000'
        },
        networkIdentifier: config.NETWORK_IDENTIFIER,
        timestamp: transactions.utils.getTimeFromBlockchainEpoch(Number(new Date()) - 10000)
    });
    tx.sign(config.genesis);
    return api.transactions.broadcast(tx.toJSON())
}

const getAccount = async (address) => {
    const accounts = await api.accounts.get({ address }).then(({ data }) => data);
    return accounts && accounts.length > 0 ? accounts[0] : undefined;
}

module.exports = {
    addBalanceFromGenesis,
    getAccount
}
