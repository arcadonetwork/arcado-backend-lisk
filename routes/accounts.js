const { createUser, getAccount, addBalanceFromGenesis, getTransactionsByAddress } = require('../modules/transactions-helpers/accounts.mod')

const routes = require('express').Router();
const liskPassphrase = require('@liskhq/lisk-passphrase');
const cryptography = require('@liskhq/lisk-cryptography');
const { Mnemonic } = liskPassphrase;

/**
 * POST to register user
 * Body: { email }
 * Return: { passphrase, address, publicKey }
 */
routes.post('/register', async (req, res) => {
    const email = req.body.email;

    const passphrase = Mnemonic.generateMnemonic();
    const keys = cryptography.getPrivateAndPublicKeyFromPassphrase(
        passphrase
    );
    const credentials = {
        email,
        address: cryptography.getAddressFromPublicKey(keys.publicKey),
        passphrase: passphrase,
        publicKey: keys.publicKey,
        privateKey: keys.privateKey
    };

    try {
        await createUser(credentials.address);
        return res.json({
            address: credentials.address,
            publicKey: credentials.publicKey,
            privateKey: credentials.privateKey,
            email,
            passphrase
        });
    } catch (error) {
        console.log(error);
        res.json({ msg: 'Could not register user Lisk blockchain', error: true, status: 400 })
    }
})

/**
 * Retrieve single user
 * Param: email
 * Return: { address, publicKey, email }
 */
routes.get('/:address', async (req, res) => {
    const address = req.params.address;
    const account = await getAccount(address);
    return res.json({
        data: account
    });
})

/**
 * Retrieve single user
 * Param: email
 * Return: { address, publicKey, email }
 */
routes.get('/:address/transactions', async (req, res) => {
    const address = req.params.address;
    const transactions = await getTransactionsByAddress(address);
    console.log(transactions);
    return res.json({
        data: transactions
    });
})

/**
 * Retrieve single user
 * Param: email
 * Return: { address, publicKey, email }
 */
routes.post('/:address/funds', async (req, res) => {
    try {
        const { address } = req.params;
        const { data } = await addBalanceFromGenesis(address);
        return res.json({
            data
        });
    } catch (e) {
        console.error(e);
    }
})

module.exports = routes;
