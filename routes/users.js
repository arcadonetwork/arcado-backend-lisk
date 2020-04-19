const { addUser, getUser } = require('../modules/users.mod');

const routes = require('express').Router();
const liskPassphrase = require('@liskhq/lisk-passphrase');
const liskCrypto = require('@liskhq/lisk-cryptography');
const { Mnemonic } = liskPassphrase;

/**
 * POST to register user
 * Body: { email }
 * Return: { passphrase, address, publicKey }
 */
routes.post('/register', (req, res) => {
    const email = req.body.email;

    const passphrase = Mnemonic.generateMnemonic();
    const liskAddressObject = liskCrypto.getAddressAndPublicKeyFromPassphrase(passphrase);
    addUser(email, liskAddressObject.address, liskAddressObject.publicKey);

    res.json({
        passphrase,
        address: liskAddressObject.address,
        publicKey: liskAddressObject.publicKey
    })
})

/**
 * Retrieve single user
 * Param: email
 * Return: { address, publicKey, email }
 */
routes.get('/:email', (req, res, next) => {
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