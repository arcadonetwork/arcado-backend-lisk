/* Hardcoded list of supported games */
const games = [
    { id: 'CSGO', name: 'Counter Strike Global Offensive' },
    { id: 'LOL', name: 'League of Legends' },
    { id: 'GTA5', name: 'Grand Theft Auto V' },
    { id: 'PUBG', name: 'PlayerUnknowns Battlegrounds' },
    { id: 'FOR', name: 'Fortnite' }
];

/**
 * Verify if game exists
 * @param {string} gameId e.g. CSGO
 * @return {boolean}
 */
const doesGameExist = gameId =>
    games.find(game => game.id === gameId)
        ? true 
        : false

module.exports = {
    games,
    doesGameExist
}