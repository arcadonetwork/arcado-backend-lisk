const { addUser, getUser } = require('../modules/users.mod');
const { createUser, getAccount } = require('../modules/transactions-helpers/users.mod')

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

    addUser(email, credentials.address, credentials.publicKey);
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
 * POST to login user
 * Body: { email, passphrase }
 * Return: { passphrase, address, publicKey }
 */
routes.post('/:email', async (req, res) => {
    const {email, passphrase} = req.body;
    const keys = cryptography.getPrivateAndPublicKeyFromPassphrase(
        passphrase
    );

    const address = cryptography.getAddressFromPublicKey(keys.publicKey);
    const user = getUser(email)

    if (!user || user.address !== address) {
        return res.json({ msg: 'User not found', error: true, status: 200 })
    }

    res.json({
        address,
        passphrase: passphrase,
        publicKey: keys.publicKey
    });
})




/**
 * Retrieve single user
 * Param: email
 * Return: { address, publicKey, email }
 */
routes.get('/:email', async (req, res) => {
    const email = req.params.email;

    const user = getUser(email);


    if (!user) {
        return res.json({ msg: 'User not found', error: true, status: 200 })
    }

    const account = await getAccount(user.address);

    return res.json({
        address: user.address,
        publicKey: user.publicKey,
        email,
        ...account
    });
})

module.exports = routes;
