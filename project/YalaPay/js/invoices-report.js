import {formToObject} from "./common.js";
import invoiceRepo from "./repository/invoice-repository.js";

async function invoiceReport(e) {
    e.preventDefault();
    const searchInput = formToObject(e.target);
    const toDate = searchInput.toDate;
    const fromDate = searchInput.fromDate;
    const invoices = await invoiceRepo.getInvoices();
    switch (searchInput.status) {
        case "All": {
            const inPeriodInvoices = invoices.filter((invoice) => invoice.invoiceDate >= fromDate && invoice.dueDate <= toDate);
            displayInvoiceReport(inPeriodInvoices);
            break;
        }
        case "Pending": {
            const pendingInvoices = invoices.filter((invoice) => invoice.amount == findBalance(invoice));
            const inPeriodInvoices = pendingInvoices.filter((invoice) => invoice.invoiceDate >= fromDate && invoice.dueDate <= toDate);
            displayInvoiceReport(inPeriodInvoices);
            break;
        }
        case "Partially Paid": {
            const partiallyPaidInvoices = invoices.filter((invoice) => invoice.amount > findBalance(invoice) && findBalance(invoice) != 0);
            const inPeriodInvoices = partiallyPaidInvoices.filter((invoice) => invoice.invoiceDate >= fromDate && invoice.dueDate <= toDate);
            displayInvoiceReport(inPeriodInvoices);
            break;
        }
        case "Paid": {
            const paidInvoices = invoices.filter((invoice) => findBalance(invoice) == 0 );
            const inPeriodInvoices = paidInvoices.filter((invoice) => invoice.invoiceDate >= fromDate && invoice.dueDate <= toDate);
            displayInvoiceReport(inPeriodInvoices);
            break;
        }
    }
}

function displayInvoiceReport(invoices) {
    const invoiceRows = invoices
        .map((invoice) => invoiceToRow(invoice))
        .join(" ");
    invoiceTable.innerHTML = `
    <tr class="table-headings">
      <th>Invoice No.</th>
      <th>Customer ID</th>
      <th>Customer Name</th>
      <th>Amount</th>
      <th>Balance</th>
      <th>Invoice Date</th>
      <th>Due Date</th>
      <th></th>
    </tr>
    ${invoiceRows}`;
}
