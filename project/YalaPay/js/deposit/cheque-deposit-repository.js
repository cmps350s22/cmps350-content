import {fetchJson, getId} from "../common/common.js";

const db = new Localbase("YalaPay.db");
const chequeDeposits = "chequeDeposits"

class ChequeDepositRepository {
    async initChequeDeposits() {
        const depositsCount = await this.getDepositsCount();
        console.log(`depositsCount: ${depositsCount}`);

        if (depositsCount === 0) {
            const deposits = await fetchJson("data/cheque-deposits.json");
            for (const deposit of deposits) {
                await this.addDeposit(deposit);
            }
        }
    }

    getDeposit(depositId) {
        return db.collection(chequeDeposits)
                 .doc({ id: depositId })
                 .get();
    }

    getDeposits() {
        return db.collection(chequeDeposits).get();
    }

    async getDepositsCount() {
        // Localbase = very poor library, it does NOT have a function to just return documents count
        // ToDo: getCount should be done by DB
        const deposits = await this.getDeposits();
        const count = deposits.length;
        return (count !== null && count !== undefined) ? count : 0;
    }
    
    addDeposit(chequeDeposit) {
        if (!chequeDeposit.id)
                chequeDeposit.id = getId();

        return db.collection(chequeDeposits).add(chequeDeposit);
    }

    updateDeposit(chequeDeposit) {
        return db.collection(chequeDeposits)
                 .doc({ id: chequeDeposit.id })
                 .update(chequeDeposit);
    }

    deleteDeposit(depositId) {
        return db.collection(chequeDeposits)
                 .doc({ id: depositId })
                 .delete();
        // ToDo: Set the status of included cheques to Awaiting
    }
}

export default new ChequeDepositRepository();