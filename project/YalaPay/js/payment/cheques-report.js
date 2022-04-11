import paymentRepo from "./payment-repository.js";
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
    const cheques = await paymentRepo.getCheques();
    await displayCheques(cheques);

    const parametersForm = document.querySelector(".report-parameters");
    parametersForm.addEventListener("submit", chequeReport);
});

async function fillStatusDD() {
    const statusDD = document.querySelector("#status");
    const data = await lookupDataRepository.getLookupData("chequeStatus");
    //Add All as the 1st option
    data.chequeStatus.unshift("All");
    const statusOptions = data.chequeStatus.map(c =>
        `<option value="${c}">${c}</option>`
    ).join(" ");
    statusDD.innerHTML = statusOptions;
}

function displayCheques(cheques) {
    const mainContent = document.querySelector(".main-content");
    const chequesRows = cheques.map(cheque => chequeToHtmlRow(cheque)).join(" ");
    mainContent.innerHTML = `
        <table class="table">
         <tr class="table-headings">
            <th>Cheque No</th>
            <th>Amount</th>
            <th>Drawer</th>
            <th>Bank Name</th>
            <th>Status</th>
            <th>Received Date</th>
            <th>Due Date</th>
         </tr>
         ${chequesRows}
        </table>`;
    displaySummary(cheques);
}

function chequeToHtmlRow(cheque) {
    return `
      <tr class="table-row">
        <td>${cheque.chequeNo}</td>
        <td>${cheque.amount}</td>
        <td>${cheque.drawer}</td>
        <td>${cheque.bankName}</td>
        <td>${cheque.status}</td>
        <td>${cheque.receivedDate}</td>
        <td>${cheque.dueDate}</td>
      </tr>`;
}

async function chequeReport(e) {
    e.preventDefault();
    const searchParams = formToObject(e.target);
    const cheques = await paymentRepo.getChequesForReport(searchParams);
    displayCheques(cheques)
}

function displaySummary(cheques) {
    const header = document.querySelector(".header");
    const chequesCount = cheques.length;
    const chequesSum = cheques.map(c => c.amount).reduce(sumReducer, 0);

    header.innerHTML = `
     <h1 class="header-title">Cheques Report</h1>
     <div class="header-card">
        <div class="icon-bg">
            <img src="img/wallet.svg" alt="" />
        </div>
        <p class="docsCount">
            <span class="counter-desc">Count: </span> ${chequesCount}
        </p>
        <div class="icon-bg">
            <img src="img/payments.svg" alt="" />
        </div>
        <p class="docsCount">
            <span class="counter-desc">Sum: </span> QR ${chequesSum}
        </p>
     </div>
    `;
}
