import {getId, sum} from "../common.js";
const db = new Localbase("YalaPay.db");
const payments = "payments";
const cheques = "cheques";

class PaymentRepository {
    // payments Operations
    async initPayments() {
        const paymentsCount = await this.getPaymentsCount();
        console.log(`paymentsCount: ${paymentsCount}`);

        if (paymentsCount === 0) {
            const paymentsUrl = "data/payments.json";
            const response = await fetch(paymentsUrl);
            const payments = await response.json();
            for (const payment of payments) {
                await this.addPayment(payment);
            }
        }
    }

    getPayment(paymentId) {
        return db
            .collection(payments)
            .doc({ paymentId: paymentId })
            .get();
    }

    async getPayments(invoiceNo) {
        if (invoiceNo) {
            let payments = await db.collection("payments").doc({ invoiceNo : invoiceNo}).get();
            // Workaround - LocalDB return a single object if 1 result match => poor library
            if (!Array.isArray(payments))
                payments = [payments]
            return payments;
        }
        else
            return db.collection(payments).get();
    }

    async getPaymentsCount() {
        // Localbase = very poor library, it does NOT have a function to just return documents count
        // ToDo: getCount should be done by DB
        const payments = await this.getPayments();
        const count = payments.length;
        return (count !== null && count !== undefined) ? count : 0;
    }

    async getTotalPayments(invoiceNo) {
        try {
            const payments = await this.getPayments(invoiceNo);
            return payments.map(c => c.amount).reduce(sum, 0);
        } catch (e) {
            return 0;
        }
    }

    addPayment(payment) {
        if (!payment.id)
            payment.id = getId();
        return db.collection(payments).add(payment);
    }

    updatePayment(updatePayment) {
        return db
            .collection(payments)
            .doc({ paymentId: updatePayment.paymentId })
            .update(updatePayment);
    }

    deletePayment(paymentId) {
        return db
            .collection(payments)
            .doc({ paymentId: paymentId })
            .delete();
    }

    //Cheque Operations
    async initCheques() {
        const chequesCount = await this.getChequesCount();
        console.log(`chequesCount: ${chequesCount}`);

        if (chequesCount === 0) {
            const chequesUrl = "data/cheques.json";
            const response = await fetch(chequesUrl);
            const cheques = await response.json();
            for (const cheque of cheques) {
                await this.addCheque(cheque);
            }
        }
    }
    
    getCheque(chequeNo) {
        return db
            .collection(cheques)
            .doc({ chequeNo: chequeNo })
            .get();
    }

    getCheques(status) {
        if (status)
            return db.collection(cheques).doc({status: status}).get();
        else
            return db.collection(cheques).get();
    }

    async getChequesCount() {
        // Localbase = very poor library, it does NOT have a function to just return documents count
        // ToDo: getCount should be done by DB
        const cheques = await this.getCheques();
        const count = cheques.length;
        return (count !== null && count !== undefined) ? count : 0;
    }

    addCheque(cheque) {
        return db.collection(cheques).add(cheque);
    }

    updateCheque(updatedCheque, chequeNo) {
        return db
            .collection(cheques)
            .doc({ chequeNo: chequeNo })
            .update(updatedCheque);
    }

    deleteCheque(chequeNo) {
        return db
            .collection(cheques)
            .doc({ chequeNo: chequeNo })
            .delete();
    }

    async sumCheques(status) {
        let sum = 0;
        let cheques = await this.getCheques(status);
        console.dir(cheques);
        if (cheques) {
            // Workaround - LocalDB return a single object if 1 result match => poor library
            if (!Array.isArray(cheques)) {
                sum = cheques.amount;
            } else {
                sum = cheques.map(c => c.amount).reduce(sum, 0);
            }
        }
        return sum;
    }

    async getChequesSummary() {
        const awaiting = await this.sumCheques("Awaiting");
        const deposited = await this.sumCheques("Deposited");
        const cashed = await this.sumCheques("Cashed");
        const returned = await this.sumCheques("Returned");

        return {awaiting, deposited, cashed, returned};
    }
}

export default new PaymentRepository();