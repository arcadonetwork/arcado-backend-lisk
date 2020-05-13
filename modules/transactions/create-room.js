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
        // Static checks for presence of `packetId`, `postage`, `security`, and `minTrust`.
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
            gameId: this.asset.gameId,
            entryFee: this.asset.entryFee,
            participants: [this.asset.address],
            distribution: this.asset.distribution,
            maxPlayers: this.asset.maxPlayers
        })

        const updatedGenesis = {
            ...genesis,
            asset
        };
        store.account.set(genesis.address, updatedGenesis);   
        
        return errors;
    }

    undoAsset(store) {
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