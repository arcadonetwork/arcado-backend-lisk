const { addUser, getUser } = require('../modules/users.mod');
const { createUser } = require('../modules/transactions-helpers/users.mod')

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
        address: cryptography.getAddressFromPublicKey(keys.publicKey),
        passphrase: passphrase,
        publicKey: keys.publicKey,
        privateKey: keys.privateKey
    };

    addUser(email, credentials.address, credentials.publicKey);
    try {
        await createUser(credentials.address);
        res.json(credentials);
    } catch (error) {
        res.json({ msg: 'Could not register user Lisk blockchain', error: true, status: 400 })
    }
})

/**
 * Retrieve single user
 * Param: email
 * Return: { address, publicKey, email }
 */
routes.get('/:email', (req, res) => {
    const email = req.params.email;
    const user = getUser(email)

    if (!user) {
        return res.json({ msg: 'User not found', error: true, status: 200 })
    }

    return res.json({
        address: user.address,
        publicKey: user.publicKey,
        email
    });
})

module.exports = routes;