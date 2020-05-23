const {
    BaseTransaction,
    TransactionError,
    utils
} = require('@liskhq/lisk-transactions');

/**
 * Join active room
 * 1. Check if room exists and if maxPlayers has been reached
 * 2. Check balance of user to pay entryFee
 * 3. Add user to game object in asset of genesis account
 */
class JoinRoomTransaction extends BaseTransaction {

    static get TYPE () {
        return 31;
    }

    static get FEE () {
        return '0';
    };

    async prepare(store) {
        await store.account.cache([
            {
                address: "16313739661670634666L", // genesis
            },
            {
                address: this.asset.address,
            }
        ]);
    }

    validateAsset() {
        return [];
    }

    applyAsset(store) {
        const errors = [];
        const genesis = store.account.get("16313739661670634666L");
        const player = store.account.get(this.asset.address);
        
        const game = genesis.asset.games.find(game => game.roomId === this.asset.roomId)
        if (!game) {
            errors.push(
                new TransactionError(
                    '"asset.roomId" does not exist',
                    this.id,
                    '.asset.roomId',
                    this.asset.roomId
                )
            );
            return errors;
        }

        if (game.participants.length >= game.maxPlayers) {
            errors.push(
                new TransactionError(
                    'Game is already full',
                    this.id,
                    '.asset.maxPlayers',
                    game.maxPlayers
                )
            );
            return errors;
        }

        const playerBalance = new utils.BigNum(player.balance);
        if (playerBalance.lt(game.entryFee)) {
            errors.push(
                new TransactionError(
                    'Insufficient balance for player',
                    this.id,
                    '.asset.entryFee',
                    player.balance
                )
            );
            return errors;
        }
        
        let asset = {
            ...genesis.asset
        }

        const gameIndex = asset.games.findIndex(game => game.roomId === this.asset.roomId)
        asset.games[gameIndex].participants.push(this.asset.address)

        const updatedGenesis = {
            ...genesis,
            asset
        };
        store.account.set(genesis.address, updatedGenesis);

        // Substract fee from user
        const entryFeeBalance = new utils.BigNum(game.entryFee)
        const updatedPlayerBalance = playerBalance.sub(entryFeeBalance);
        const updatedPlayer = {
            ...player,
            balance: updatedPlayerBalance.toString()
        }

        store.account.set(player.address, updatedPlayer);
        
        return errors;
    }

    undoAsset(store) {
        // Add entryfee back to user balance
        const errors = [];
        

        return errors;
    }

}

module.exports = JoinRoomTransaction;