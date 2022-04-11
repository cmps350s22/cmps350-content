import invoiceRepo from "./repository/invoice-repository.js";
import customerRepo from "./repository/customer-repository.js";
import paymentRepo from "./repository/payment-repository.js";
import {formToObject, addCommonUIFragments} from "./common.js";

let isEdit = false;

document.addEventListener("DOMContentLoaded", async () => {
    // Load and inject common html fragments (to avoid redundancy)
    await addCommonUIFragments('Invoices', 'wallet.svg', 'Customer name', 'invoice-form.html');

    await customerRepo.initCustomers();
    await invoiceRepo.initInvoices();
    await paymentRepo.initPayments();
    await paymentRepo.initCheques();

    await displayInvoices();
    await fillCustomerDD();
    window.deleteInvoice = deleteInvoice;
    window.updateInvoice = updateInvoice;
    window.redirectToPaymentsPage = redirectToPaymentsPage;

    const popupForm = document.querySelector(".popup-form");
    const searchForm = document.querySelector(".search-form");

    popupForm.addEventListener("submit", addInvoice);
    searchForm.addEventListener("submit", searchInvoices);
});

async function displayInvoices() {
    const invoices = await invoiceRepo.getInvoices();
    invoicesToHtmlTable(invoices)
}

function invoicesToHtmlTable(invoices) {
    const mainContent = document.querySelector(".main-content");
    const invoiceRows = invoices
        .map(invoice => invoiceHtmlToRow(invoice))
        .join(" ");

    mainContent.innerHTML = `
    <table class="table">
    <tr class="table-headings">
      <th>Invoice No.</th>
      <th>Customer ID</th>
      <th>Customer Name</th>
      <th>Amount</th>
      <th>Balance</th>
      <th>Inv. Date</th>
      <th>Due Date</th>
      <th></th>
    </tr>
    ${invoiceRows}
    </table>
   `;
}

function invoiceHtmlToRow(invoice) {
    return `
    <tr class="table-row" data-invoice-id='${invoice.id}'>
        <td>${invoice.id}</td>
        <td>${invoice.customerId}</td>
        <td>${invoice.customerName}</td>
        <td>${invoice.amount}</td>
        <td>${invoice.balance}</td>
        <td>${invoice.invoiceDate}</td>
        <td>${invoice.dueDate}</td>
        <td class=editing-btns>
            <img class="edit-btn" src="img/pen.svg" 
                onclick="updateInvoice('${invoice.id}')"/>
            <img class="delete-btn" src="img/trash.svg" 
                onclick="deleteInvoice('${invoice.id}')"/>
            <img class="payments-btn" src="img/payments.svg" 
                onclick="redirectToPaymentsPage('${invoice.id}')"/>
        </td>
    </tr>
    `;
}

async function fillCustomerDD() {
    const customerDD = document.querySelector("#customerId");
    const customers = await customerRepo.getCustomers();
    const customerOptions = customers.map(c =>
            `<option value="${c.id}">${c.companyName}</option>`
        ).join(" ");
    customerDD.innerHTML = customerOptions;
}

async function addInvoice(e) {
    e.preventDefault();
    const invoice = formToObject(e.target);
    console.dir(invoice);
    const customerDD = document.querySelector("#customerId");
    invoice.customerName = customerDD.options[customerDD.selectedIndex].text;
    //assign the customer ID
    /*const customer = await customerRepo.getCustomerByName(invoice.customerName);
    invoice.customerId = customer.customerId; */

    if (isEdit) {
        await invoiceRepo.updateInvoice(invoice);
        isEdit = false;
    } else {
        await invoiceRepo.addInvoice(invoice);
    }

    await displayInvoices();
    e.target.reset();
}

async function deleteInvoice(invoiceNo) {
    const confirmed = confirm(`Are you sure you want to delete invoice #${invoiceNo}?`);
    if (confirmed) {
        await invoiceRepo.deleteInvoice(invoiceNo);
        document.querySelector(`tr[data-invoice-id='${invoiceNo}']`).remove();
    }
}

async function updateInvoice(invoiceNo) {
    const invoice = await invoiceRepo.getInvoice(invoiceNo);
    //console.log("updateInvoice", invoice);
    document.querySelector("#id").value = invoice.id;
    document.querySelector("#customerId").value = invoice.customerId;
    //document.querySelector("#customerId").value = invoice.customerName;
    document.querySelector("#amount").value = invoice.amount;
    document.querySelector("#invoiceDate").value = invoice.invoiceDate;
    document.querySelector("#dueDate").value = invoice.dueDate;
    isEdit = true;
}

async function searchInvoices(e) {
    e.preventDefault();
    const searchInput = formToObject(e.target);
    const invoice = await invoiceRepo.getInvoiceByCustomer(searchInput.searchText);
    if (invoice) {
        //console.log(customer);
        invoicesToHtmlTable([ invoice ]);
    } else {
        alert("No data found");
    }
}

function redirectToPaymentsPage(invoiceNo) {
    sessionStorage.invoiceNo = invoiceNo;
    document.location = "payments.html";
}