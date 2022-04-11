import {getId, sum} from "../common.js";
import paymentRepo from "./payment-repository.js";

const db = new Localbase("YalaPay.db");
const invoices = "invoices";

class InvoiceRepository {
    async initInvoices() {
        const invoicesCount = await this.getInvoicesCount();
        console.log(`invoicesCount: ${invoicesCount}`);

        if (invoicesCount === 0) {
            const invoicesUrl = "data/invoices.json";
            const response = await fetch(invoicesUrl);
            const invoices = await response.json();
            for (const invoice of invoices) {
                await this.addInvoice(invoice);
            }
        }
    }

    async getInvoice(invoiceNo) {
        let invoice = await db.collection(invoices)
                 .doc({ id : invoiceNo })
                 .get();

        if (invoice) {
            const totalPayments = await paymentRepo.getTotalPayments(invoiceNo);
            invoice.balance = invoice.amount - totalPayments;
        }
        return invoice;
    }

    getInvoiceByCustomer(customerName) {
        return db.collection(invoices)
            .doc({ customerName : customerName })
            .get();
    }

    async getInvoices() {
        let invoices = await db.collection("invoices").get();
        invoices = await this.getInvoicesBalance(invoices);
        return invoices;
    }

    async getInvoicesBalance(invoices) {
        for (const [i, invoice] of  invoices.entries()) {
            const totalPayments = await paymentRepo.getTotalPayments(invoice.id);
            //console.log("totalPayments", totalPayments);
            invoices[i].balance = invoice.amount - totalPayments;
        }
        return invoices;
    }

    async getInvoicesCount() {
        // Localbase = very poor library, it does NOT have a function to just return documents count
        // ToDo: getCount should be done by DB
        const invoices = await db.collection("invoices").get();
        const count = invoices.length;
        return (count !== null && count !== undefined) ? count : 0;
    }

    addInvoice(invoice) {
        if (!invoice.id)
            invoice.id = getId();

        return db.collection(invoices).add(invoice);
    }

    updateInvoice(updatedInvoice) {
        return db
            .collection(invoices)
            .doc({ id: updatedInvoice.id })
            .update(updatedInvoice);
    }

    deleteInvoice(invoiceNo) {
        return db
            .collection(invoices)
            .doc({ id : invoiceNo })
            .delete();
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