import { sum } from "../common.js";
const db = new Localbase("YalaPay.db");
const payments = "payments";
const cheques = "cheques";

class PaymentRepository {
    // payments Operations
    async initPayments() {
        const paymentsUrl = "data/payments.json";
        const response = await fetch(paymentsUrl);
        const data = await response.json();
        for (const payment of data) {
            const paymentExists = await db
                .collection(payments)
                .doc({ paymentId: payment.paymentId })
                .get();
            if (paymentExists == undefined)
                await db.collection(payments).add(payment);
        }
    }

    getPayment(paymentId) {
        return db
            .collection(payments)
            .doc({ paymentId: paymentId })
            .get();
    }

    getPayments() {
        return db.collection(payments).get();
    }

    async getPaymentsByInvoiceNo(invoiceNo) {
        const payments = await this.getPayments();
        return payments.filter((payment) => payment.invoiceNo === invoiceNo);
    }

    addPayment(payment) {
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
        const chequesUrl = "data/cheques.json";
        const response = await fetch(chequesUrl);
        const data = await response.json();
        for (const cheque of data) {
            const chequeExists = await db
                .collection(cheques)
                .doc({ chequeNo: cheque.chequeNo })
                .get();
            if (chequeExists == undefined)
                await db.collection(cheques).add(cheque);
        }
    }

    getCheque(chequeNo) {
        return db
            .collection(cheques)
            .doc({ chequeNo: chequeNo })
            .get();
    }

    getCheques() {
        return db.collection(cheques).get();
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

    async getChequesSummary() {
        const cheques = await this.getCheques();
        const awaiting = cheques
            .filter(c => c.status === "Awaiting")
            .map(i => i.amount)
            .reduce(sum, 0);

        const deposited = cheques
            .filter(c => c.status === "Deposited")
            .map(i => i.amount)
            .reduce(sum, 0);

        const cashed = cheques
            .filter(c => c.status === "Cashed")
            .map(i => i.amount)
            .reduce(sum, 0);

        const returned = cheques
            .filter(c => c.status === "Returned")
            .map(i => i.amount)
            .reduce(sum, 0);

        return {awaiting, deposited, cashed, returned};
    }
}

export default new PaymentRepository();