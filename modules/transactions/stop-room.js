const {
    BaseTransaction,
    TransactionError,
    utils
} = require('@liskhq/lisk-transactions');

/**
 * Stop the created room and distribute the rewards based on the percentages set
 */
class StopRoomTransaction extends BaseTransaction {

    static get TYPE () {
        return 33;
    }

    static get FEE () {
        return '0';
    };

    async prepare(store) {
        await store.account.cache([
            {
                address: "16313739661670634666L" // genesis
            },
            {
                address: this.asset.first
            },
            {
                address: this.asset.second
            },
            {
                address: this.asset.third
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
        const room = genesis.asset.rooms.find(room => room.roomId === this.asset.roomId)
        if (room.createdBy !== this.asset.address) {
            errors.push(
                new TransactionError(
                    '"asset.address" does not match createdBy field for room - you are not the owner of the room',
                    this.id,
                    '.asset.address',
                    this.asset.address,
                    room.createdBy
                )
            );
            return errors;
        }

        let asset = {
            ...genesis.asset
        }

        // Update status for game room
        const roomIndex = asset.rooms.findIndex(room => room.roomId === this.asset.roomId)
        asset.rooms[roomIndex].status = 2 // stopped

        const updatedGenesis = {
            ...genesis,
            asset
        };
        store.account.set(genesis.address, updatedGenesis);

        // Pay out the winnings
        const distribution = asset.rooms[roomIndex].distribution
        const numOfParticipants = asset.rooms[roomIndex].participants.length
        const entryFeeBalance = new utils.BigNum(asset.rooms[roomIndex].entryFee)
        const total = entryFeeBalance.mul(numOfParticipants)
        const firstWinnings = total.div(100).mul(distribution.first)
        const secondWinnings = total.div(100).mul(distribution.second)
        const thirdWinnings = total.div(100).mul(distribution.third)

        // First player
        const firstPlayer = store.account.get(this.asset.first);
        const firstBalance = new utils.BigNum(firstPlayer.balance);
        const updatedFirstBalance = firstBalance.plus(firstWinnings)
        const updatedFirstPlayer = {
            ...firstPlayer,
            balance: updatedFirstBalance.toString()
        }
        store.account.set(firstPlayer.address, updatedFirstPlayer);

        // Second player
        const secondPlayer = store.account.get(this.asset.second);
        const secondBalance = new utils.BigNum(secondPlayer.balance);
        const updatedSecondBalance = secondBalance.plus(secondWinnings);
        const updatedSecondPlayer = {
            ...secondPlayer,
            balance: updatedSecondBalance.toString()
        }
        store.account.set(secondPlayer.address, updatedSecondPlayer);

        // Third player
        const thirdPlayer = store.account.get(this.asset.third);
        const thirdBalance = new utils.BigNum(thirdPlayer.balance);
        const updatedThirdBalance = thirdBalance.plus(thirdWinnings);
        const updatedThirdPlayer = {
            ...thirdPlayer,
            balance: updatedThirdBalance.toString()
        }
        store.account.set(thirdPlayer.address, updatedThirdPlayer);


        return errors;
    }

    /* Revert status game */
    undoAsset(store) {
        const errors = [];
        const genesis = store.account.get("16313739661670634666L");

        const roomIndex = genesis.asset.rooms.findIndex(room => room.roomId === this.asset.roomId)

        let asset = {
            ...genesis.asset
        }
        asset.rooms[roomIndex].status = 1
        const updatedGenesis = {
            ...genesis,
            asset
        };
        store.account.set(genesis.address, updatedGenesis);

        return errors;
    }

}

module.exports = StopRoomTransaction;
