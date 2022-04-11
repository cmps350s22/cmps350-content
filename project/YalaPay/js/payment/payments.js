import paymentRepo from "./payment-repository.js";
import invoiceRepo from "../invoice/invoice-repository.js";
import lookupDataRepository from "../common/lookup-data-repository.js";
import {formToObject, addCommonUIFragments} from "../common/common.js";

let isEdit = false;
let chequeNoBeforeUpdate = 0;

document.addEventListener("DOMContentLoaded", async () => {
    // Load and inject common html fragments (to avoid redundancy)
    await addCommonUIFragments('Payments', 'payments.svg', 'Amount', 'payment-form.html');

    await displayInvoiceDetails();
    await displayPayments();
    await fillPaymentModesDD();
    await fillBanksDD();

    window.deletePayment = deletePayment;
    window.updatePayment = updatePayment;
    window.displayChequeImage = displayChequeImage;

    const paymentModesDD = document.querySelector("#paymentMode");
    const popupForm = document.querySelector(".popup-form");
    const searchForm = document.querySelector(".search-form");

    popupForm.addEventListener("submit", addPayment);
    searchForm.addEventListener("submit", searchPayments);
    paymentModesDD.addEventListener("change", onPaymentModeChange);
});

async function displayPayments() {
    const payments = await paymentRepo.getPayments(sessionStorage.invoiceNo);
    //console.log(payments);
    paymentsToHtmlTable(payments);
}

function paymentsToHtmlTable(payments) {
    const mainContent = document.querySelector(".main-content");
    const paymentRows = payments
        .map(payment => paymentToHtmlRow(payment))
        .join(" ");

    mainContent.innerHTML = `
     <table class="table">
        <tr class="table-headings">
          <th>Payment ID</th>
          <th>Invoice No</th>
          <th>Amount</th>
          <th>Payment Date</th>
          <th>Payment Mode</th>
          <th>Cheque No</th>
          <th> </th>
        </tr>
        ${paymentRows}
     </table>`;
}

function paymentToHtmlRow(payment) {
    return `
    <tr class="table-row" data-payment-id='${payment.id}'>
        <td>${payment.id}</td>
        <td>${payment.invoiceNo}</td>
        <td>${payment.amount}</td>
        <td>${payment.paymentDate}</td>
        <td>${payment.paymentMode}</td>
        <td>${payment.chequeNo ? payment.chequeNo : ''}</td>
        <td class=editing-btns>
            <img class="edit-btn" src="img/pen.svg" onclick="updatePayment('${payment.id}')"/>
            <img class="delete-btn" src="img/trash.svg" onclick="deletePayment('${payment.id}', ${payment.chequeNo})"/>
            ${(payment.chequeNo) ?
                `<img class="view-btn" src="img/view.svg" onclick="displayChequeImage('${payment.chequeNo}')"/>`
                : ''
            }
        </td>
    </tr>
    `;
}

// ToDo: read from DB
async function fillPaymentModesDD() {
    const paymentModesDD = document.querySelector("#paymentMode");
    const data = await lookupDataRepository.getLookupData("paymentModes");
    const paymentOptions = data.paymentModes.map(paymentMode =>
            `<option value="${paymentMode}">${paymentMode}</option>`
    ).join(" ");
    paymentModesDD.innerHTML = paymentOptions;
}

function onPaymentModeChange() {
    const paymentModesDD = document.querySelector("#paymentMode");
    const chequeDetailsDiv = document.querySelector(".chequeDetails");
    console.log("onPaymentModeChange", paymentModesDD.value);
    if (paymentModesDD.value === "Cheque") {
        chequeDetailsDiv.style.display = "";
    } else {
        chequeDetailsDiv.style.display = "none";
    }
}

// ToDo: read from DB
async function fillBanksDD() {
    const bankSelect = document.querySelector("#bankName");
    const data = await lookupDataRepository.getLookupData("banks");
    const banksOptions = data.banks.map(
        (bankName) => `<option value="${bankName}">${bankName}</option>`
    ).join(" ");
    bankSelect.innerHTML = banksOptions;
}

async function addPayment(e) {
    e.preventDefault();
    const formData = formToObject(e.target);
    console.log("addPayment", JSON.stringify(formData));

    let cheque;
    const payment = {
        id: formData.id,
        invoiceNo: sessionStorage.invoiceNo,
        amount: parseInt(formData.amount),
        paymentDate: formData.paymentDate,
        paymentMode: formData.paymentMode
    };

    console.log("addPayment", JSON.stringify(payment));

    if (formData.paymentMode == "Cheque") {
        payment.chequeNo = parseInt(formData.chequeNo);
        cheque = {
            chequeNo: payment.chequeNo,
            amount: parseInt(formData.amount),
            drawer: formData.drawer,
            bankName: formData.bankName,
            status: "Awaiting",
            receivedDate: formData.receivedDate,
            dueDate: formData.dueDate,
            // ToDo: upload the cheque image to the server and set the chequeImageUri
            chequeImageUri: "cheque2.jpg" //formData.chequeImageUri.name,
        };
        console.log("addPayment", JSON.stringify(cheque));
    }

    if (isEdit) {
        await paymentRepo.updatePayment(payment);
        if (cheque)
            await paymentRepo.updateCheque(cheque, chequeNoBeforeUpdate);
        isEdit = false;
    } else {
        await paymentRepo.addPayment(payment);
        if (cheque)
            await paymentRepo.addCheque(cheque);
    }

    await displayPayments();
    e.target.reset();
}

async function searchPayments(e) {
    e.preventDefault();
    const searchInput = formToObject(e.target);
    const payment = await paymentRepo.getInvoicePayments(sessionStorage.invoiceNo, searchInput.searchText);
    if (payment) {
        //console.log(customer);
        paymentsToHtmlTable([ payment ]);
    } else {
        alert("No data found");
    }
}

async function deletePayment(paymentId, chequeNo) {
    const confirmed = confirm(`Are you sure you want to delete payment #${paymentId}?`);
    if (confirmed) {
        if (chequeNo) {
            await paymentRepo.deleteCheque(chequeNo);
        }
        await paymentRepo.deletePayment(paymentId);
        document.querySelector(`tr[data-payment-id='${paymentId}']`).remove();
    }


}

async function updatePayment(paymentId) {
    isEdit = true;
    const payment = await paymentRepo.getPayment(paymentId);
    console.log("updatePayment", JSON.stringify(payment));
    document.querySelector("#id").value = payment.id;
    document.querySelector("#amount").value = payment.amount;
    document.querySelector("#paymentDate").value = payment.paymentDate;
    document.querySelector("#paymentMode").value = payment.paymentMode;

    if (payment.paymentMode === "Cheque") {
        const cheque = await paymentRepo.getCheque(payment.chequeNo);
        chequeNoBeforeUpdate = cheque.chequeNo;
        document.querySelector("#chequeNo").value = cheque.chequeNo;
        document.querySelector("#drawer").value = cheque.drawer;
        document.querySelector("#bankName").value = cheque.bankName;
        document.querySelector("#status").value = cheque.status;
        document.querySelector("#receivedDate").value = cheque.receivedDate;
        document.querySelector("#dueDate").value = cheque.dueDate;
        //document.querySelector("#chequeImage").value = cheque.chequeImageUri;
    }
    onPaymentModeChange();
}

async function displayInvoiceDetails() {
    const invoiceInfo = document.querySelector(".invoice-info");
    const invoice = await invoiceRepo.getInvoice(sessionStorage.invoiceNo);
    invoiceInfo.innerHTML = `
        <h3>Invoice Details</h3>
        <p>Invoice No: ${invoice.id}</p>
        <p>Company Name: ${invoice.customerName}</p>
        <p>Amount: ${invoice.amount} - Balance: ${invoice.balance}</p>
        <p>Invoice Date: ${invoice.invoiceDate} - Due Date: ${invoice.dueDate}</p>
        <br>
    `;
}

async function displayChequeImage(chequeNo){
    const cheque = await paymentRepo.getCheque(chequeNo);
    const imageURL = cheque.chequeImageUri;
    window.open(`./img/cheques/${imageURL}`, '_blank');
}