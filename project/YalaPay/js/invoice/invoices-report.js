import invoiceRepo from "./invoice-repository.js";
import {displayCurrentUser, getFooter, fetchHtml, formToObject, sumReducer} from "../common/common.js";
import lookupDataRepository from "../common/lookup-data-repository.js";

document.addEventListener("DOMContentLoaded", async () => {
    // Load and inject common html fragments (to avoid redundancy)
    const navBar = document.querySelector(".nav-bar");
    navBar.innerHTML = await fetchHtml('nav-bar.html');

    const footer = document.querySelector(".footer");
    footer.innerHTML = getFooter();

    displayCurrentUser();
    await fillStatusDD();
    const invoices = await invoiceRepo.getInvoices();
    await displayInvoices(invoices);

    const parametersForm = document.querySelector(".report-parameters");
    parametersForm.addEventListener("submit", invoiceReport);
});

async function fillStatusDD() {
    const statusDD = document.querySelector("#status");
    const data = await lookupDataRepository.getLookupData("invoiceStatus");
    //Add All as the 1st option
    data.invoiceStatus.unshift("All");
    const statusOptions = data.invoiceStatus.map(c =>
        `<option value="${c}">${c}</option>`
    ).join(" ");
    statusDD.innerHTML = statusOptions;
}

function displayInvoices(invoices) {
    const mainContent = document.querySelector(".main-content");
    const invoicesRows = invoices.map(invoice => invoiceToHtmlRow(invoice)).join(" ");
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
         </tr>
         ${invoicesRows}
        </table>`;
    displaySummary(invoices);
}

function invoiceToHtmlRow(invoice) {
    return `
      <tr class="table-row">
        <td>${invoice.id}</td>
        <td>${invoice.customerId}</td>
        <td>${invoice.customerName}</td>
        <td>${invoice.amount}</td>
        <td>${invoice.balance}</td>
        <td>${invoice.invoiceDate}</td>
        <td>${invoice.dueDate}</td>
      </tr>`;
}

async function invoiceReport(e) {
    e.preventDefault();
    const searchParams = formToObject(e.target);
    const invoices = await invoiceRepo.getInvoicesForReport(searchParams);
    displayInvoices(invoices)
}

function displaySummary(invoices) {
    const header = document.querySelector(".header");
    const invoicesCount = invoices.length;
    const invoicesSum = invoices.map(c => c.amount).reduce(sumReducer, 0);

    header.innerHTML = `
     <h1 class="header-title">Invoices Report</h1>
     <div class="header-card">
        <div class="icon-bg">
            <img src="../../img/wallet.svg" alt="" />
        </div>
        <p class="docsCount">
            <span class="counter-desc">Count: </span> ${invoicesCount}
        </p>
        <div class="icon-bg">
            <img src="../../img/deposits.svg" alt="" />
        </div>
        <p class="docsCount">
            <span class="counter-desc">Sum: </span> QR ${invoicesSum}
        </p>
     </div>
    `;
}
