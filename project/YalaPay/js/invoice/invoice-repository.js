import {fetchJson, getId, sumReducer} from "../common/common.js";
import paymentRepo from "../payment/payment-repository.js";

const db = new Localbase("YalaPay.db");
const invoices = "invoices";

class InvoiceRepository {
    async initInvoices() {
        const invoicesCount = await this.getInvoicesCount();
        console.log(`invoicesCount: ${invoicesCount}`);

        if (invoicesCount === 0) {
            const invoices = await fetchJson("data/invoices.json");
            for (const invoice of invoices) {
                await this.addInvoice(invoice);
            }
        }
    }

    async getInvoice(invoiceNo) {
        const invoice = await db.collection(invoices)
                                .doc({ id : invoiceNo })
                                .get();

        if (invoice) {
            const totalPayments = await paymentRepo.getTotalPayments(invoiceNo);
            invoice.balance = invoice.amount - totalPayments;
        }
        return invoice;
    }

    getInvoiceByCustomer(customerName) {
        // Only returns 1 document!!! Not impressed with Localbase => Do not use in a real world project
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

        const totalInvoices = invoices.map(i => i.amount).reduce(sumReducer, 0);

        //due in 30 days
        currentDate.setDate(new Date().getDate()+30);
        const afterToday = currentDate.toJSON().slice(0,10);
        const within30Days =
            invoices
                .filter(invoice => invoice.dueDate >= today && invoice.dueDate <= afterToday)
                .map(i => i.amount)
                .reduce(sumReducer, 0);

        //due in more than 30 days
        currentDate.setDate(new Date().getDate());
        const afterMonth = currentDate.toJSON().slice(0,10);
        const after30Days = invoices
            .filter(invoice => invoice.dueDate >= afterMonth)
            .map(i => i.amount)
            .reduce(sumReducer, 0);

        return {totalInvoices, within30Days, after30Days}

    }

    async getInvoicesForReport({status, fromDate, toDate}) {
        console.log(status, fromDate, toDate);
        let invoices = await this.getInvoices();

        switch (status) {
            case "Unpaid": {
                invoices = invoices.filter(i => i.amount === i.balance);
                break;
            }
            case "Partially Paid": {
                invoices = invoices.filter(i => i.balance > 0);
                break;
            }
            case "Paid": {
                invoices = invoices.filter(i => i.balance === 0);
                break;
            }
        }

        if (fromDate && toDate) {
            invoices = invoices.filter(c => c.receivedDate >= fromDate && c.dueDate <= toDate);
        }
        return invoices;
    }
}

export default new InvoiceRepository();