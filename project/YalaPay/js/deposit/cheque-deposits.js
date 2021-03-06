import paymentRepo from "../payment/payment-repository.js";
import chequeDepositsRepo from "./cheque-deposit-repository.js";
import lookupDataRepository from "../common/lookup-data-repository.js";
import {addCommonUIFragments, formToObject} from "../common/common.js";

let isEdit = false;
let depositCheques = [];
let depositStatusDD;

document.addEventListener("DOMContentLoaded", async () => {
    // Load and inject common html fragments (to avoid redundancy)
    await addCommonUIFragments('Cheque Deposits', 'deposits.svg', 'Status', 'deposit-form.html');

    depositStatusDD = document.querySelector("#status");
    const popupForm = document.querySelector(".popup-form");
    const searchForm = document.querySelector(".search-form");

    await displayChequeDeposits();
    await fillBankAccountsDD();
    await fillDepositStatusDD();

    window.onIncludeChequeChange = onIncludeChequeChange;
    window.onReturnChequeChange = onReturnChequeChange;
    window.onReturnReasonChange = onReturnReasonChange;

    window.onDeleteDeposit = onDeleteDeposit;
    window.onUpdateDeposit = onUpdateDeposit;

    document.querySelector("#depositDate").value = new Date().toJSON().slice(0, 10);

    popupForm.addEventListener("submit", onSubmitDeposit);
    //statusDD.addEventListener("change", displayReasonSelect);
    searchForm.addEventListener("submit", searchDeposits);

    document.querySelector(".add-btn").addEventListener("click", async (event) => {
        depositCheques = await paymentRepo.getCheques("Awaiting");
        await displayDepositCheques(depositCheques,false);
        depositStatusDD.disabled = true;
    });

    depositStatusDD.addEventListener("change", async (event) => {
        const depositStatus = depositStatusDD.value;
        const chequeStatus = depositStatus === "Cashed with Returns" ? "Cashed" : depositStatus;
        // Set the status of cheques every time the deposit status change
        for (let i = 0; i++; i < depositCheques.length) {
            depositCheques[i].status = chequeStatus;
            depositStatus[i].hasChanged = true;
            delete depositStatus[i].returnReason;
        }

        const showReturnChequeSection = (depositStatus === "Cashed with Returns");
        await displayDepositCheques(depositCheques, showReturnChequeSection);
    });
});

async function displayDepositCheques(depositCheques, showReturnChequeSection) {
    const chequesList = document.querySelector(".cheques-list");
    //console.log("depositCheques", depositCheques);
    const chequeForms = depositCheques
                            .map(c => chequeToForm(c, showReturnChequeSection))
                            .join("");
    chequesList.innerHTML = `${chequeForms}`;
    if (showReturnChequeSection) {
        await fillReturnReasonDDs();
    }
}

function chequeToForm(cheque, showReturnChequeSection) {
    return `
    <div class="cheque-card">
            <p for="chequeNo">Cheque No: ${cheque.chequeNo}</p>
            <p>Amount: ${cheque.amount}</p>
            <p>Status : ${cheque.status}</p>
            <p>Due Date : ${cheque.dueDate} <span class="daydiff">(${dateDifference(cheque.dueDate)})</span></p>
            <label style="display: flex">Include 
                <input type="checkbox"
                    ${cheque.status !== "Awaiting" ? 'checked' : ''}
                    onclick="onIncludeChequeChange(this, ${cheque.chequeNo})" >
            </label>
            ${showReturnChequeSection ?
            `<label style="display: flex">Returned
                <input type="checkbox"
                    ${cheque.status === "Returned" ? 'checked' : ''}
                    onclick="onReturnChequeChange(this, ${cheque.chequeNo})"> 
            </label>
            <select class="returnReasonDD"
                value="${cheque.returnReason}"
                onchange="onReturnReasonChange(this, ${cheque.chequeNo})">
            </select>`: '' }
    </div>`;
}

function onIncludeChequeChange(cb, chequeNo) {
    const index = depositCheques.findIndex(c => c.chequeNo == chequeNo);
    const status = cb.checked === true ? "Deposited" : "Awaiting";
    depositCheques[index].status = status;
    depositCheques[index].hasChanged = true;
}

function onReturnChequeChange(cb, chequeNo) {
    const index = depositCheques.findIndex(c => c.chequeNo == chequeNo);
    console.log("index", index);
    const status = cb.checked === true ? "Returned" : "Cashed";
    depositCheques[index].status = status;
    depositCheques[index].hasChanged = true;
}

function onReturnReasonChange(dd, chequeNo) {
    const index = depositCheques.findIndex(c => c.chequeNo == chequeNo);
    depositCheques[index].returnReason = dd.value;
    depositCheques[index].hasChanged = true;
}

async function displayChequeDeposits() {
    const deposits = await chequeDepositsRepo.getDeposits();
    depositsToHtmlTable(deposits);
}

function depositsToHtmlTable(deposits) {
    const mainContent = document.querySelector(".main-content");
    const depositRows =
        deposits.map(deposit => depositToHtmlRow(deposit)).join(" ");
    
    mainContent.innerHTML = `
       <table class="table">
         <tr class="table-headings">
            <th>Deposit ID</th>
            <th>Deposit Date</th>
            <th>Bank Account Number</th>
            <th>Status</th>
            <th>Cheque Nos</th>
            <th></th>
         </tr>
         ${depositRows}
        </table>`;
}

function depositToHtmlRow(deposit) {
    return `
    <tr class="table-row" data-deposit-id='${deposit.id}'>
        <td>${deposit.id}</td>
        <td>${deposit.depositDate}</td>
        <td>${deposit.bankAccountNo}</td>
        <td>${deposit.status}</td>
        <td>${deposit.chequeNos.toString()}</td>
        <td class=editing-btns>
            ${deposit.status === "Deposited" ?
            `<img class="edit-btn" src="img/pen.svg" 
                onclick="onUpdateDeposit('${deposit.id}')"/>
            <img class="delete-btn" src="img/trash.svg" 
                onclick="onDeleteDeposit('${deposit.id}')"/>`
            :
            `<img class="edit-btn" src="img/view.svg" 
                onclick="onUpdateDeposit('${deposit.id}', true)"/>`
            }
        </td>
    </tr>`;
}

async function fillBankAccountsDD() {
    const bankAccountsDD = document.querySelector("#bankAccountNo");
    const data = await lookupDataRepository.getLookupData("bankAccounts");
    const accountOptions = data.bankAccounts.map(a =>
            `<option value="${a.accountNo}">${a.bank} - ${a.accountNo}</option>`
    );
    bankAccountsDD.innerHTML = accountOptions.join(" ");
}

async function fillDepositStatusDD() {
    const data = await lookupDataRepository.getLookupData("depositStatus");
    const statusOptions = data.depositStatus.map(s =>
            `<option value="${s}">${s}</option>`
    ).join(" ");
    depositStatusDD.innerHTML = statusOptions;
}

async function fillReturnReasonDDs() {
    const data = await lookupDataRepository.getLookupData("returnReasons");
    data.returnReasons.unshift("");
    const returnReasonDDs = document.querySelectorAll(".returnReasonDD");
    for (const reasonsDD of returnReasonDDs) {
        const reasonOptions = data.returnReasons.map(reason =>
            `<option value="${reason}">${reason}</option>`
        );
        reasonsDD.innerHTML = reasonOptions.join(" ");
    }
}

async function onSubmitDeposit(e) {
    e.preventDefault();
    const formData = formToObject(e.target);
    console.log(formData);
    const deposit = {
        id: formData.id,
        depositDate: formData.depositDate,
        bankAccountNo: formData.bankAccountNo,
        status: formData.status ?? "Deposited",
        chequeNos: depositCheques.filter(c => c.status != "Awaiting").map(c => c.chequeNo)
    };
    console.log("addDeposit", JSON.stringify(deposit));
    
    for (const cheque of depositCheques) {
        if (cheque.hasChanged) {
            delete cheque.hasChanged;
            await paymentRepo.updateCheque(cheque, cheque.chequeNo);
        }
    }
    if (isEdit) {
        await chequeDepositsRepo.updateDeposit(deposit);
        isEdit = false;
    } else {
        await chequeDepositsRepo.addDeposit(deposit);
    }
    depositCheques = [];
    await displayChequeDeposits();
    e.target.reset();
}

async function onDeleteDeposit(depositId) {
    const confirmed = confirm(`Are you sure you want to delete deposit #${depositId}?`);
    if (confirmed) {
        await chequeDepositsRepo.deleteDeposit(depositId);
        document.querySelector(`tr[data-deposit-id='${depositId}']`).remove();
    }
}

async function onUpdateDeposit(depositId, viewMode) {
    const deposit = await chequeDepositsRepo.getDeposit(depositId);
    document.querySelector("#id").value = deposit.id;
    document.querySelector("#depositDate").value = deposit.depositDate;
    document.querySelector("#bankAccountNo").value = deposit.bankAccountNo;
    depositStatusDD.value = deposit.status;
    depositStatusDD.disabled = false;

    depositCheques = await Promise.all( deposit.chequeNos.map(async chequeNo =>
        await paymentRepo.getCheque(chequeNo)
    ));
    const showReturnChequeSection = (deposit.status === "Cashed with Returns");
    await displayDepositCheques(depositCheques, showReturnChequeSection);
    isEdit = true;

    if (viewMode) {
        const depositForm = document.querySelector('#cheque-deposit-form');
        Array.from(depositForm.elements).forEach(e => e.disabled = true);
    }
}

async function searchDeposits(e) {
    e.preventDefault();
    const searchInput = formToObject(e.target);
    console.log(searchInput);
    const deposit = await chequeDepositsRepo.getDeposit(searchInput.searchText);
    console.log(deposit);
    depositsToHtmlTable([deposit]);
}

function dateDifference(dueDateString) {
    const today = new Date();
    const dueDate = new Date(dueDateString);
    return Math.floor((dueDate - today) / (1000*60*60*24));
}