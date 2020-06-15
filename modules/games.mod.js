/* Hardcoded list of supported games */
const games = [
    {
        id: 'CSGO',
        name: 'Counter Strike Global Offensive',
        image: 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-original-577x577/s3/022016/untitled-1_243.png?itok=NFEakbIj',
        description: 'Counter-Strike: Global Offensive is a multiplayer first-person shooter video game developed by Valve and Hidden Path Entertainment.'
    },
    {
        id: 'LOL',
        name: 'League of Legends',
        image: 'https://i.pinimg.com/564x/30/0e/58/300e58c8416a68dcfcf1761501348243.jpg',
        description: 'League of Legends is a multiplayer online battle arena video game developed and published by Riot Games for Microsoft Windows and macOS.'
    },
    {
        id: 'GTA5',
        name: 'Grand Theft Auto V',
        image: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/BE/nl/999/EP1004-BLES01807_00-AVGRANDTHE000005/1550722573000/image?w=480&h=480&bg_color=000000&opacity=100&_version=00_09_000',
        description: 'Grand Theft Auto V is a 2013 action-adventure game developed by Rockstar North and published by Rockstar Games.'
    },
    {
        id: 'PUBG',
        name: 'PlayerUnknowns Battlegrounds',
        image: 'https://i.pinimg.com/564x/7c/2f/b2/7c2fb2fa6676a731afd66ca52c6017f9.jpg',
        description: 'PlayerUnknown\'s Battlegrounds is an online multiplayer battle royale game developed and published by PUBG Corporation.'
    },
    {
        id: 'FOR',
        name: 'Fortnite',
        image: 'http://pngimg.com/uploads/fortnite/fortnite_PNG158.png',
        description: 'Fortnite is an online video game developed by Epic Games and released in 2017.'
    },
    {
        id: 'WZ',
        name: 'Warzone',
        image: 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/032020/call_of_duty_warzone.jpg?i6rWXJMIidlEglxTpt8sktQHko5s78Fi&itok=TNXNSCzt',
        description: 'Call of Duty: Warzone is a free-to-play battle royale video game released on March 10, 2020.'
    }
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
