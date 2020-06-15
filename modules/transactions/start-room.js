const {
    BaseTransaction,
    TransactionError,
    utils
} = require('@liskhq/lisk-transactions');

/**
 * Start the created room
 */
class StartRoomTransaction extends BaseTransaction {

    static get TYPE () {
        return 32;
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

        // Check if sender is the owner of the room otherwise reject
        const game = genesis.asset.games.find(game => game.roomId === this.asset.roomId)
        if (game.createdBy !== this.asset.address) {
            errors.push(
                new TransactionError(
                    '"asset.address" does not match createdBy field for room - you are not the owner of the room',
                    this.id,
                    '.asset.address',
                    this.asset.address,
                    game.createdBy
                )
            );
            return errors;
        }

        let asset = {
            ...genesis.asset
        }

        const gameIndex = asset.games.findIndex(game => game.roomId === this.asset.roomId)
        asset.games[gameIndex].status = 1 // started

        const updatedGenesis = {
            ...genesis,
            asset
        };
        store.account.set(genesis.address, updatedGenesis);
        
        return errors;
    }

    /* Revert status game */
    undoAsset(store) {
        const errors = [];
        const genesis = store.account.get("16313739661670634666L");
        
        const gameIndex = genesis.asset.games.findIndex(game => game.roomId === this.asset.roomId)
        
        let asset = {
            ...genesis.asset
        }
        asset.games[gameIndex].status = 0
        const updatedGenesis = {
            ...genesis,
            asset
        };
        store.account.set(genesis.address, updatedGenesis); 

        return errors;
    }

}

module.exports = StartRoomTransaction;