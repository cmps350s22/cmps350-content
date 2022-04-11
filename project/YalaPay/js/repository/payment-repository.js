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
        return db.collection(payments)
            .doc({ id: paymentId })
            .get();
    }

    getInvoicePayments(invoiceNo, amount) {
        // Unfortunately the line below only returns the 1st match 😒
        return db.collection("payments").doc({invoiceNo: invoiceNo, amount: parseInt(amount)}).get();
    }

    async getPayments(invoiceNo) {
        if (invoiceNo) {
            // Unfortunately the line below only returns the 1st match 😒
            //let payments = await db.collection("payments").doc({ invoiceNo : invoiceNo}).get();
            // ToDo: in phase 2 all data querying/filtering must be done by DB
            const payments = await db.collection("payments").get();
            return payments.filter(p => p.invoiceNo === invoiceNo);
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

    updatePayment(payment) {
        return db.collection(payments)
            .doc({ id: payment.id })
            .update(payment);
    }

    deletePayment(paymentId) {
        return db.collection(payments)
            .doc({ id : paymentId })
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
        return db.collection(cheques)
            .doc({ chequeNo: parseInt(chequeNo) })
            .get();
    }

    async getChequesForReport({status, fromDate, toDate}) {
        let cheques;
        if (status)
            cheques = await this.getCheques(status);
        else
            cheques = await this.getCheques();

        if (fromDate && toDate) {
            cheques = cheques.filter(c => c.receivedDate >= fromDate && c.dueDate <= toDate);
        }
        return cheques;
    }

    async getCheques(status) {
        if (status) {
            // Unfortunately the line below only return the 1st one 😒
            //return db.collection(cheques).doc({status: status}).get();
            // ToDo: in phase 2 all data querying/filtering must be done by DB
            const cheques = await db.collection("cheques");
            return cheques.filter(c => c.status = status);
        }
        else
            return db.collection("cheques").get();
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
        return db.collection(cheques)
            .doc({ chequeNo: parseInt(chequeNo) })
            .delete();
    }

    async sumCheques(status) {
        let sum = 0;
        const cheques = await this.getCheques(status);
        if (cheques) {
             sum = cheques.map(c => c.amount).reduce(sum, 0);
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