const chequeDepositDb = new Localbase("chequeDeposit.db");
const chequeDepositCollection = "chequeDeposits"
const chequeDepositUrl = "data/cheque-deposits.json";

class ChequeDepositRepository {
    //cheque deposit operations
    async initChequeDeposits() {
        const response = await fetch(chequeDepositUrl);
        const data = await response.json();
        for (const chequeDeposit of data) {
            const chequeExists = await chequeDepositDb
                .collection(chequeDepositCollection)
                .doc({ depositId: chequeDeposit.depositId })
                .get();
            if (chequeExists == undefined)
                await chequeDepositDb.collection(chequeDepositCollection).add(chequeDeposit);
        }
    }

    getDeposit(depositId) {
        return chequeDepositDb
            .collection(chequeDepositCollection)
            .doc({ depositId: depositId })
            .get();
    }

    getDeposits() {
        return chequeDepositDb.collection(chequeDepositCollection).get();
    }

    addDeposit(chequeDeposit) {
        return chequeDepositDb.collection(chequeDepositCollection).add(chequeDeposit);
    }

    updateDeposit(updatedChequeDeposit) {
        return chequeDepositDb
            .collection(chequeDepositCollection)
            .doc({ depositId: updatedChequeDeposit.depositId })
            .update(updatedChequeDeposit);
    }

    deleteDeposit(depositId) {
        return chequeDepositDb
            .collection(chequeDepositCollection)
            .doc({ depositId: depositId })
            .delete();
    }
}

export default new ChequeDepositRepository();