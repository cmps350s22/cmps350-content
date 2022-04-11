const db = new Localbase("YalaPay.db");
const chequeDeposits = "chequeDeposits"

class ChequeDepositRepository {
    async initChequeDeposits() {
        const chequeDepositsUrl = "data/cheque-deposits.json";
        const response = await fetch(chequeDepositsUrl);
        const data = await response.json();
        for (const chequeDeposit of data) {
            const chequeExists = await db
                .collection(chequeDeposits)
                .doc({ depositId: chequeDeposit.depositId })
                .get();
            if (chequeExists == undefined)
                await db.collection(chequeDeposits).add(chequeDeposit);
        }
    }

    getDeposit(depositId) {
        return db
            .collection(chequeDeposits)
            .doc({ depositId: depositId })
            .get();
    }

    getDeposits() {
        return db.collection(chequeDeposits).get();
    }

    addDeposit(chequeDeposit) {
        return db.collection(chequeDeposits).add(chequeDeposit);
    }

    updateDeposit(updatedChequeDeposit) {
        return db
            .collection(chequeDeposits)
            .doc({ depositId: updatedChequeDeposit.depositId })
            .update(updatedChequeDeposit);
    }

    deleteDeposit(depositId) {
        return db
            .collection(chequeDeposits)
            .doc({ depositId: depositId })
            .delete();
    }
}

export default new ChequeDepositRepository();