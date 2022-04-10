const invoiceDb = new Localbase("invoice.db");
const invoiceCollection = "invoices";
const invoiceUrl = "data/invoices.json";

class InvoiceRepository {
    // Invoice Operations
    async initInvoices() {
        const response = await fetch(invoiceUrl);
        const data = await response.json();
        for (const invoice of data) {
            const invoiceExists = await invoiceDb
                .collection(invoiceCollection)
                .doc({ invoiceNo: invoice.invoiceNo })
                .get();
            if (invoiceExists == undefined)
                await invoiceDb.collection(invoiceCollection).add(invoice);
        }
    }

    getInvoice(invoiceNo) {
        return invoiceDb
            .collection(invoiceCollection)
            .doc({ invoiceNo: invoiceNo })
            .get();
    }

    getInvoices() {
        return invoiceDb.collection(invoiceCollection).get();
    }

    addInvoice(invoice) {
        return invoiceDb.collection(invoiceCollection).add(invoice);
    }

    updateInvoice(updatedInvoice) {
        return invoiceDb
            .collection(invoiceCollection)
            .doc({ invoiceNo: updatedInvoice.invoiceNo })
            .update(updatedInvoice);
    }

    deleteInvoice(invoiceNo) {
        return invoiceDb
            .collection(invoiceCollection)
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
}

export default new InvoiceRepository();