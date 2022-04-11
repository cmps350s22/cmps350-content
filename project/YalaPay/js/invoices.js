import invoiceRepo from "./repository/invoice-repository.js";
import customerRepo from "./repository/customer-repository.js";
import paymentRepo from "./repository/payment-repository.js";
import {formToObject, addCommonUIFragments} from "./common.js";

let isEdit = false;
let balances = [];

document.addEventListener("DOMContentLoaded", async () => {
    // Load and inject common html fragments (to avoid redundancy)
    await addCommonUIFragments('Invoices', 'wallet.svg', 'Invoice amount', 'invoice-form.html');

    await customerRepo.initCustomers();
    await invoiceRepo.initInvoices();
    await paymentRepo.initPayments();
    await getInvoicesBalance();
    await displayInvoices();
    await displayCustomerNames();
    window.deleteInvoice = deleteInvoice;
    window.updateInvoice = updateInvoice;
    window.goToPaymentpage = goToPaymentpage;

    const popupForm = document.querySelector(".popup-form");
    const invoiceTable = document.querySelector(".table");

    const searchForm = document.querySelector(".search-form");
    const header = document.querySelector(".header");
    const reportForm = document.querySelector(".status-report");
    const accountInfo = document.querySelector(".account-info")

    popupForm.addEventListener("submit", addInvoice);
    searchForm.addEventListener("submit", searchInvoices);
    reportForm.addEventListener("submit", invoiceReport);
});

async function displayInvoices() {
    const mainContent = document.querySelector(".main-content");

    const invoices = await invoiceRepo.getInvoices();
    const invoiceRows = invoices
        .map((invoice) => invoiceToRow(invoice))
        .join(" ");

    mainContent.innerHTML = `
    <table class="table">
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
    ${invoiceRows}
    </table>
   `;
}

function invoiceToRow(invoice) {
    return `
    <tr class="table-row">
        <td onclick="goToPaymentpage(${invoice.id})">${
        invoice.id
    }</td>
        <td onclick="goToPaymentpage(${invoice.id})">${
        invoice.customerId
    }</td>
        <td onclick="goToPaymentpage(${invoice.id})">${
        invoice.customerName
    }</td>
        <td onclick="goToPaymentpage(${invoice.id})">${
        invoice.amount
    }</td>
        <td onclick="goToPaymentpage(${invoice.id})">
            
        </td>
        <td onclick="goToPaymentpage(${invoice.id})">${
        invoice.invoiceDate
    }</td>
        <td onclick="goToPaymentpage(${invoice.id})">${
        invoice.dueDate
    }</td>
        <td class=editing-btns>
            <img class="edit-btn" src="img/pen.svg" onclick="updateInvoice('${
                invoice.id
            }')"/>
            <img class="delete-btn" src="img/trash.svg" onclick="deleteInvoice('${
                invoice.id
            }')"/>
        </td>
    </tr>
    `;
}

async function displayCustomerNames() {
    const customerSelect = document.querySelector("#customer-name");
    const customers = await customerRepo.getCustomers();
    const customerOptions = customers.map(
        (customer) =>
            `<option value="${customer.companyName}">${customer.companyName}</option>`
    );
    customerSelect.innerHTML = customerOptions.join(" ");
}

async function addInvoice(e) {
    e.preventDefault();
    const invoice = formToObject();
    //assign the customer ID
    const customer = await customerRepo.getCustomerByName(invoice.customerName);
    invoice.customerId = customer.customerId;

    if (isEdit) {
        await invoiceRepo.updateInvoice(invoice);
        await getInvoicesBalance();
        isEdit = false;
    } else {
        await invoiceRepo.addInvoice(invoice);
        await getInvoicesBalance();
    }

    await displayInvoices();
    e.target.reset();
}

async function deleteInvoice(invoiceNo) {
    await invoiceRepo.deleteInvoice(invoiceNo);
    await displayInvoices();
}

async function updateInvoice(invoiceNo) {
    const invoice = await invoiceRepo.getInvoice(parseInt(invoiceNo));
    document.querySelector("#id").value = invoice.id;
    document.querySelector("#customer-id").value = invoice.customerId;
    document.querySelector("#customer-name").value = invoice.customerName;
    document.querySelector("#amount").value = invoice.amount;
    document.querySelector("#invoice-date").value = invoice.invoiceDate;
    document.querySelector("#due-date").value = invoice.dueDate;
    isEdit = true;
}

async function getInvoicesBalance() {
    const payments = await paymentRepo.getPayments();
    const invoices = await invoiceRepo.getInvoices();
    for (const invoice of invoices) {
        const invoiceNoPayments = payments.filter(
            (payment) => payment.invoiceNo == invoice.id
        );
        let balance = invoice.amount;
        for (const payment of invoiceNoPayments) {
            balance -= payment.amount;
        }
        const invoiceBalance = {
            invoiceNo: invoice.id,
            balance: balance,
        };
        balances.push(invoiceBalance);
    }
}

async function searchInvoices(e) {
    e.preventDefault();
    const searchInput = formToObject(e.target);
    const invoice = await invoiceRepo.getInvoice(parseInt(searchInput.invoiceNo));
    invoiceTable.innerHTML = `
    <tr class="table-headings">
      <th>Invoice No.</th>
      <th>Customer ID</th>
      <th>Customer Name</th>
      <th>Amount</th>
      <th>Balance</th>
      <th>Invoice Date</th>
      <th>Due Date</th>
      <th>        </th>
    </tr>
    ${invoiceToRow(invoice)}`;
}

function goToPaymentpage(invoiceNo) {
    sessionStorage.setItem("invoiceNo", invoiceNo);
    document.location = "payments.html";
}

function findBalance(invoice) {
    const invoiceBalance = balances.filter(
        (x) => x.invoiceNo == invoice.invoiceNo
    );
    if (invoiceBalance == undefined) {
        return parseInt(invoice.amount);
    }
    return invoiceBalance[0].balance;
}