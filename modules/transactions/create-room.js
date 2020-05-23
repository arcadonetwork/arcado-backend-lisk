const {
    BaseTransaction,
    TransactionError,
    utils
} = require('@liskhq/lisk-transactions');

/**
 * Create new room with details
 */
class CreateRoomTransaction extends BaseTransaction {

    static get TYPE () {
        return 30;
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
        const errors = [];
        const distributionSum = (this.asset.distribution.first + this.asset.distribution.second + this.asset.distribution.third)
        if (distributionSum !== 100) {
            errors.push(
                new TransactionError(
                    'Invalid "asset.distribution" defined on transaction -> not equal to 100',
                    this.id,
                    '.asset.distribution',
                    this.asset.distribution
                )
            );
        }

        return errors;
    }

    applyAsset(store) {
        const errors = [];
        const genesis = store.account.get("16313739661670634666L");
        let asset = {
            games: [],
            ...genesis.asset
        }

        asset.games.push({
            createdBy: this.asset.address,
            name: this.asset.name,
            roomId: this.asset.roomId,
            gameId: this.asset.gameId,
            entryFee: this.asset.entryFee, // string
            participants: [this.asset.address],
            distribution: this.asset.distribution,
            maxPlayers: this.asset.maxPlayers
        })

        const updatedGenesis = {
            ...genesis,
            asset
        };
        store.account.set(genesis.address, updatedGenesis);

        // No need for balance property in game object
        // Don't need this property as we can calculate the players * entryFee and use the distribution to pay out
        const player = store.account.get(this.asset.address);
        const playerBalance = new utils.BigNum(player.balance);
        const entryFeeBalance = new utils.BigNum(this.asset.entryFee)
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
        const genesis = store.account.get("16313739661670634666L");
        
        const gameIndex = genesis.asset.games.findIndex(game => game.gameId === this.asset.gameId)
        
        let asset = {
            ...genesis.asset
        }
        asset.games.splice(gameIndex, 1)
        const updatedGenesis = {
            ...genesis,
            asset
        };
        store.account.set(genesis.address, updatedGenesis); 

        return errors;
    }

}

module.exports = CreateRoomTransaction;