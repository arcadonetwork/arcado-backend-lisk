// In-mem DB for [ { email, address, publicKey }]
let usersDB = [];

const getAllUsers = () => (usersDB)

const getUser = email => usersDB.find(user => user.email === email)

const addUser = (email, address, publicKey) => {
    usersDB.push({
        email,
        address,
        publicKey
    })
}

module.exports = {
    getAllUsers,
    getUser,
    addUser
}