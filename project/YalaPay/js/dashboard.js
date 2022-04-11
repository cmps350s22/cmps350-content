import paymentRepo from "./repository/payment-repository.js";
import invoiceRepo from "./repository/invoice-repository.js";
import {displayCurrentUser, getFooter, getHtml} from "./common.js";

document.addEventListener("DOMContentLoaded", async () => {
    // Load and inject common html fragments (to avoid redundancy)
    const navBar = document.querySelector(".nav-bar");
    navBar.innerHTML = await getHtml('nav-bar.html');

    const footer = document.querySelector(".footer");
    footer.innerHTML = getFooter();

    displayCurrentUser();
    await invoiceRepo.initInvoices();
    await paymentRepo.initCheques();
    await displayInvoicesSummary();
    await displayChequesSummary();
});

async function displayInvoicesSummary(){
    const invoicesBox = document.querySelector(".invoices");
    const {totalInvoices, within30Days, after30Days} = await invoiceRepo.getInvoicesSummary();
    console.log(totalInvoices, within30Days, after30Days);

    invoicesBox.innerHTML = `
    <h1 class="dash-title">invoices</h1>
    <div class="card">
        <h3 class="card-title">All</h3>
        <p class="amount green">${totalInvoices} <span> QR</span></p>
    </div>
    <div class="card">
        <h3 class="card-title">Due within 30 days</h3>
        <p class="amount purple">${within30Days} <span> QR</span></p>
    </div>
    <div class="card">
        <h3 class="card-title">Due in more than 30 days</h3>
        <p class="amount red">${after30Days} <span> QR</span></p>
    </div>
    `
}

async function displayChequesSummary() {
    const chequesBox = document.querySelector(".cheques");
    const {awaiting, deposited, cashed, returned} = await paymentRepo.getChequesSummary();
    console.log(awaiting, deposited, cashed, returned);

    chequesBox.innerHTML = `
    <h1 class="dash-title">Cheques</h1>
            <div class="card">
                <h3 class="card-title">Awaiting</h3>
                <p class="amount yellow">${awaiting} <span> QR</span></p>
            </div>
            <div class="card">
                <h3 class="card-title">Deposited</h3>
                <p class="amount purple">${deposited} <span> QR</span></p>
            </div>
            <div class="card">
                <h3 class="card-title">Cashed</h3>
                <p class="amount green">${cashed} <span> QR</span></p>
            </div>
            <div class="card">
                <h3 class="card-title">Returned</h3>
                <p class="amount red">${returned} <span> QR</span></p>
            </div>
    `
}