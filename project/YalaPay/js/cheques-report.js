import paymentRepo from "./repository/payment-repository.js";
import {displayCurrentUser, getFooter, getHtml, formToObject, sum} from "./common.js";

document.addEventListener("DOMContentLoaded", async () => {
    // Load and inject common html fragments (to avoid redundancy)
    const navBar = document.querySelector(".nav-bar");
    navBar.innerHTML = await getHtml('nav-bar.html');

    const footer = document.querySelector(".footer");
    footer.innerHTML = getFooter();

    displayCurrentUser();
    await paymentRepo.initCheques();
    const cheques = await paymentRepo.getCheques();
    console.log(cheques);
    await displayCheques(cheques);
    window.viewChequeImage = displayChequeImage;
});

const reportForm = document.querySelector(".status-report");
reportForm.addEventListener("submit", chequeReport);

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
            <th></th>
         </tr>
         ${chequesRows}
        </table>`;
    displayDocsCount(cheques);
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
/*    const status = searchParams.status;
    const toDate = searchParams.toDate;
    const fromDate = searchParams.fromDate;*/
    const cheques = await paymentRepo.getChequesForReport(searchParams);
    displayCheques(cheques)
}

function displayDocsCount(cheques) {
    const header = document.querySelector(".header");
    const chequesCount = cheques.length;
    const chequesSum = cheques.reduce(sum, 0);

    header.innerHTML = `
     <h1 class="header-title">Cheques</h1>
     <div class="header-card">
        <div class="icon-bg">
            <img src="img/wallet.svg" alt="" />
        </div>
        <p class="docsCount">
            ${chequesCount} <span class="counter-desc">Count</span>
        </p>
        <div class="icon-bg">
            <img src="img/money-bill-1-wave.svg" alt="" />
        </div>
        <p class="docsCount">
            QR ${chequesSum}  <span class="counter-desc">Sum</span>
        </p>
     </div>
    `;
}
