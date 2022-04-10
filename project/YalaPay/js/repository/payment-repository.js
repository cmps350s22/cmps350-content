const paymentDb = new Localbase("payment.db");
const chequeDb = new Localbase("cheque.db");
const paymentCollection = "payments";
const chequeCollection = "cheque";
const paymentUrl = "data/payments.json";
const chequeUrl = "data/cheques.json";

class PaymentRepository {
    // payments Operations
    async initPayments() {
        const response = await fetch(paymentUrl);
        const data = await response.json();
        for (const payment of data) {
            const paymentExists = await paymentDb
                .collection(paymentCollection)
                .doc({ paymentId: payment.paymentId })
                .get();
            if (paymentExists == undefined)
                await paymentDb.collection(paymentCollection).add(payment);
        }
    }

    getPayment(paymentId) {
        return paymentDb
            .collection(paymentCollection)
            .doc({ paymentId: paymentId })
            .get();
    }

    getPayments() {
        return paymentDb.collection(paymentCollection).get();
    }

    async getPaymentsByInvoiceNo(invoiceNo) {
        const payments = await this.getPayments();
        return payments.filter((payment) => payment.invoiceNo == invoiceNo);
    }

    addPayment(payment) {
        return paymentDb.collection(paymentCollection).add(payment);
    }

    updatePayment(updatePayment) {
        return paymentDb
            .collection(paymentCollection)
            .doc({ paymentId: updatePayment.paymentId })
            .update(updatePayment);
    }

    deletePayment(paymentId) {
        return paymentDb
            .collection(paymentCollection)
            .doc({ paymentId: paymentId })
            .delete();
    }

    //Cheque Operations
    async initCheques() {
        const response = await fetch(chequeUrl);
        const data = await response.json();
        for (const cheque of data) {
            const chequeExists = await chequeDb
                .collection(chequeCollection)
                .doc({ chequeNo: cheque.chequeNo })
                .get();
            if (chequeExists == undefined)
                await chequeDb.collection(chequeCollection).add(cheque);
        }
    }

    getCheque(chequeNo) {
        return chequeDb
            .collection(chequeCollection)
            .doc({ chequeNo: chequeNo })
            .get();
    }

    getCheques() {
        return chequeDb.collection(chequeCollection).get();
    }

    addCheque(cheque) {
        return chequeDb.collection(chequeCollection).add(cheque);
    }

    updateCheque(updatedCheque, oldChequeNo) {
        return chequeDb
            .collection(chequeCollection)
            .doc({ chequeNo: oldChequeNo })
            .update(updatedCheque);
    }

    deleteCheque(chequeNo) {
        return chequeDb
            .collection(chequeCollection)
            .doc({ chequeNo: chequeNo })
            .delete();
    }
}

export default new PaymentRepository();