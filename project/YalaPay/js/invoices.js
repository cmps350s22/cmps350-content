import invoiceRepo from "./repository/invoice-repository";
import customerRepo from "./repository/customer-repository";
import paymentRepo from "./repository/payment-repository";

let isEdit = false;
let balances = [];

window.onload = async () => {
    generateAccount();
    await invoiceRepo.initInvoices();
    await customerRepo.initCustomers();
    await paymentRepo.initPayments();
    await getInvoicesBalance();
    await showInvoiceData();
    await showCustomerNames();
    await showCounter();
    window.deleteInvoice = deleteInvoice;
    window.updateInvoice = updateInvoice;
    window.goToPaymentpage = goToPaymentpage;
};

const popupForm = document.querySelector(".popup-form");
const invoiceTable = document.querySelector(".table");
const customerSelect = document.querySelector("#customer-name");
const searchForm = document.querySelector(".search");
const header = document.querySelector(".header");
const reportForm = document.querySelector(".status-report");
const accountInfo = document.querySelector(".account-info")

popupForm.addEventListener("submit", addInvoice);
searchForm.addEventListener("submit", searchInvoices);
reportForm.addEventListener("submit", invoiceReport);


function generateAccount(){
    const name = sessionStorage.getItem("name");
    accountInfo.innerHTML = `
    <img class="profile-img" src="img/profile.png" alt="" />
          <span class="account-name"
              >${name} 
              <p class="account-loc">Doha, Qatar</p></span
          >
    `
}

function formToObject(form) {
    const formdata = new FormData(form);
    const data = {};
    for (const [key, value] of formdata) {
        data[key] = value;
    }
    return data;
}

async function showInvoiceData() {
    const invoices = await invoiceRepo.getInvoices();
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
      <th>        </th>
    </tr>
    ${invoiceRows}`;
}

function showInvoiceReport(invoices) {
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
      <th>        </th>
    </tr>
    ${invoiceRows}`;
}

function invoiceToRow(invoice) {
    return `
    <tr class="table-row">
        <td onclick="goToPaymentpage(${invoice.invoiceNo})">${
        invoice.invoiceNo
    }</td>
        <td onclick="goToPaymentpage(${invoice.invoiceNo})">${
        invoice.customerId
    }</td>
        <td onclick="goToPaymentpage(${invoice.invoiceNo})">${
        invoice.customerName
    }</td>
        <td onclick="goToPaymentpage(${invoice.invoiceNo})">${
        invoice.amount
    }</td>
        <td onclick="goToPaymentpage(${invoice.invoiceNo})">${findBalance(
        invoice
    )}</td>
        <td onclick="goToPaymentpage(${invoice.invoiceNo})">${
        invoice.invoiceDate
    }</td>
        <td onclick="goToPaymentpage(${invoice.invoiceNo})">${
        invoice.dueDate
    }</td>
        <td class=editing-btns>
            <img class="edit-btn" src="img/pen.svg" onclick="updateInvoice('${
                invoice.invoiceNo
            }')"/>
            <img class="delete-btn" src="img/trash.svg" onclick="deleteInvoice('${
                invoice.invoiceNo
            }')"/>
        </td>
    </tr>
    `;
}

async function showCustomerNames() {
    const customers = await customerRepo.getCustomers();
    const customerOptions = customers.map(
        (customer) =>
            `<option value="${customer.companyName}">${customer.companyName}</option>`
    );
    customerSelect.innerHTML = customerOptions.join(" ");
}

async function addInvoice(e) {
    e.preventDefault();
    const invoice = formToObject(e.target);
    //assign the customer ID
    const customer = await customerRepo.getCustomerByName(invoice.customerName);
    invoice.customerId = customer.customerId;

    if (isEdit) {
        invoice.invoiceNo = parseInt(invoice.invoiceNo);
        await invoiceRepo.updateInvoice(invoice);
        await getInvoicesBalance();
        isEdit = false;
    } else {
        //assign the invoice number
        const invoices = await invoiceRepo.getInvoices();
        invoice.invoiceNo = invoices.length + 1;
        await invoiceRepo.addInvoice(invoice);
        await getInvoicesBalance();
    }

    await showInvoiceData();
    popupForm.reset();
}

async function deleteInvoice(invoiceNo) {
    await invoiceRepo.deleteInvoice(parseInt(invoiceNo));
    await showInvoiceData();
}

async function updateInvoice(invoiceNo) {
    const invoice = await invoiceRepo.getInvoice(parseInt(invoiceNo));
    document.querySelector("#invoiceNo").value = invoice.invoiceNo;
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
            (payment) => payment.invoiceNo == invoice.invoiceNo
        );
        let balance = invoice.amount;
        for (const payment of invoiceNoPayments) {
            balance -= payment.amount;
        }
        const invoiceBalance = {
            invoiceNo: invoice.invoiceNo,
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

async function showCounter() {
    const invoices = await invoiceRepo.getInvoices();
    const invoicesCount = invoices.length;
    let sum = 0;
    for (const invoice of invoices) {
        sum += invoice.amount;
    }
    header.innerHTML = `
    <h1 class="header-title">Invoices</h1>
    <div class="count-card">
        <div class="icon-bg">
            <img src="img/wallet.svg" alt="" />
        </div>
        <p class="counter">
            ${invoicesCount} <span class="counter-desc">Total Invoices </span>
        </p>
        <div class="icon-bg">
            <img src="img/money-bill-1-wave.svg" alt="" />
        </div>
        <p class="counter">
            $ ${sum}  <span class="counter-desc">Sum Invoices</span>
        </p>
    </div>
    `;
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

async function invoiceReport(e) {
    e.preventDefault();
    const searchInput = formToObject(e.target);
    const toDate = searchInput.toDate;
    const fromDate = searchInput.fromDate;
    const invoices = await invoiceRepo.getInvoices();
    switch (searchInput.status) {
        case "All": {
            const inPeriodInvoices = invoices.filter((invoice) => invoice.invoiceDate >= fromDate && invoice.dueDate <= toDate);
            showInvoiceReport(inPeriodInvoices);
            break;
        }
        case "Pending": {
            const pendingInvoices = invoices.filter((invoice) => invoice.amount == findBalance(invoice));
            const inPeriodInvoices = pendingInvoices.filter((invoice) => invoice.invoiceDate >= fromDate && invoice.dueDate <= toDate);
            showInvoiceReport(inPeriodInvoices);
            break;
        }
        case "Partially Paid": {
            const partiallyPaidInvoices = invoices.filter((invoice) => invoice.amount > findBalance(invoice) && findBalance(invoice) != 0);
            const inPeriodInvoices = partiallyPaidInvoices.filter((invoice) => invoice.invoiceDate >= fromDate && invoice.dueDate <= toDate);
            showInvoiceReport(inPeriodInvoices);
            break;
        }
        case "Paid": {
            const paidInvoices = invoices.filter((invoice) => findBalance(invoice) == 0 );
            const inPeriodInvoices = paidInvoices.filter((invoice) => invoice.invoiceDate >= fromDate && invoice.dueDate <= toDate);
            showInvoiceReport(inPeriodInvoices);
            break;
        }
    }
}
