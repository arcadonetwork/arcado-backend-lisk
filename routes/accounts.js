const { addBalanceFromGenesis } = require('../modules/transactions-helpers/accounts.mod')

const routes = require('express').Router();


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
