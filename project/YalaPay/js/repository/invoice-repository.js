import {getId, sum} from "../common.js";

const db = new Localbase("YalaPay.db");
const invoices = "invoices";

class InvoiceRepository {
    async initInvoices() {
        const invoicesCount = await this.getInvoicesCount();
        console.log(`invoicesCount: ${invoicesCount}`);

        if (invoicesCount === 0) {
            const invoiceUrl = "data/invoices.json";
            const response = await fetch(invoiceUrl);
            const invoices = await response.json();
            for (const invoice of invoices) {
                await this.addInvoice(invoice);
            }
        }
    }

    getInvoice(invoiceNo) {
        return db
            .collection(invoices)
            .doc({ invoiceNo: invoiceNo })
            .get();
    }

    getInvoices() {
        return db.collection(invoices).get();
    }

    async getInvoicesCount() {
        // Localbase = very poor library, it does NOT have a function to just return documents count
        const invoices = await this.getInvoices();
        const count = invoices.length;
        return (count !== null && count !== undefined) ? count : 0;
    }

    addInvoice(invoice) {
        if (invoice.id)
            invoice.id = invoice.id.toString()
        else
            invoice.id = getId();

        return db.collection(invoices).add(invoice);
    }

    updateInvoice(updatedInvoice) {
        return db
            .collection(invoices)
            .doc({ invoiceNo: updatedInvoice.invoiceNo })
            .update(updatedInvoice);
    }

    deleteInvoice(invoiceNo) {
        return db
            .collection(invoices)
            .doc({ invoiceNo: invoiceNo })
            .delete();
    }

    async getBalance(invoice) {
        const payments = await this.getPaymentsByInvoiceNo(invoice.invoiceNo);
        let balance = invoice.amount;
        for (const payment of payments) {
            balance -= payment.amount;
        }
        return balance;
    }

    async getInvoicesSummary() {
        const invoices = await this.getInvoices();
        const currentDate = new Date();
        const today = currentDate.toJSON().slice(0,10);

        const totalInvoices = invoices.map(i => i.amount).reduce(sum, 0);

        //due in 30 days
        currentDate.setDate(new Date().getDate()+30);
        const afterToday = currentDate.toJSON().slice(0,10);
        const within30Days =
            invoices
                .filter(invoice => invoice.dueDate >= today && invoice.dueDate <= afterToday)
                .map(i => i.amount)
                .reduce(sum, 0);

        //due in more than 30 days
        currentDate.setDate(new Date().getDate());
        const afterMonth = currentDate.toJSON().slice(0,10);
        const after30Days = invoices
            .filter(invoice => invoice.dueDate >= afterMonth)
            .map(i => i.amount)
            .reduce(sum, 0);

        return {totalInvoices, within30Days, after30Days}

    }
}

export default new InvoiceRepository();