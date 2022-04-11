import paymentRepo from "../payment/payment-repository.js";
import chequeDepositsRepo from "./cheque-deposit-repository.js";
import lookupDataRepository from "../common/lookup-data-repository.js";
import {addCommonUIFragments, formToObject} from "../common/common.js";

let isEdit = false;
let includedChequeNos = [];

document.addEventListener("DOMContentLoaded", async () => {
    // Load and inject common html fragments (to avoid redundancy)
    await addCommonUIFragments('Cheque Deposits', 'deposits.svg', 'Status', 'deposit-form.html');
    
    await displayChequeDeposits();
    await fillBankAccountsDD();
    await fillDepositStatusDD();
    await displayAwaitingCheques();
    window.addToChequeNos = addToChequeNos;
    window.fillReturnReasonsDD = fillReturnReasonsDD;
    window.deleteDeposit = deleteDeposit;
    window.updateDeposit = updateDeposit;

    document.querySelector("#depositDate").value = new Date().toJSON().slice(0,10);
    const popupForm = document.querySelector(".popup-form");
    const searchForm = document.querySelector(".search-form");
    const statusDD = document.querySelector("#status");

    popupForm.addEventListener("submit", addDeposit);
    statusDD.addEventListener("change", displayReasonSelect);
    searchForm.addEventListener("submit", searchDeposits);
});

async function displayAwaitingCheques() {
    const chequesList = document.querySelector(".cheques-list");
    const cheques = await paymentRepo.getCheques("Awaiting");
    console.log(cheques);
    const chequeForms = cheques
        .map(cheque => chequeToForm(cheque))
        .join("");
    chequesList.innerHTML = `${chequeForms}`;
}

async function displayDepositCheques(chequeNumbers) {
    const chequesList = document.querySelector(".cheques-list");
    const depositedCheques = await Promise.all( chequeNumbers.map(async chequeNo =>
        await paymentRepo.getCheque(chequeNo)
    ));
    includedChequeNos = chequeNumbers;
    console.log("depositedCheques", depositedCheques);

    const chequeForms = depositedCheques
                            .map(c => chequeToForm(c, true))
                            .join("");
    chequesList.innerHTML = `${chequeForms}`;
}

function chequeToForm(cheque, included) {
    return `
    <div class="cheque-card">
            <p for="chequeNo">Cheque No: ${cheque.chequeNo}</p>
            <p>Amount: ${cheque.amount}</p>
            <p>Status : ${cheque.status}</p>
            <p>Due Date : ${cheque.dueDate} <span class="daydiff">(${dateDifference(cheque.dueDate)})</span></p>
            <p>Include? 
                <input type="checkbox" class="cbox" checked=${included ? true : false}
                    onclick="addToChequeNos(this,'${cheque.chequeNo}')">
            </p>
            <div class="returns"></div>
    </div>`;
}

function addToChequeNos(cb, chequeNo) {
    if (cb.checked === true) {
        includedChequeNos.push(chequeNo);
    } else if (cb.checked === false) {
        const index = includedChequeNos.indexOf(chequeNo);
        if (index > -1) {
            includedChequeNos.splice(index, 1);
        }
    }
}

async function displayChequeDeposits() {
    const deposits = await chequeDepositsRepo.getDeposits();
    depositsToHtmlTable(deposits);
}

function depositsToHtmlTable(deposits) {
    const mainContent = document.querySelector(".main-content");
    
    const depositRows = 
        deposits.map(deposit => depositToHtmlRow(deposit))
                .join(" ");
    
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
            <img class="edit-btn" src="img/pen.svg" 
                onclick="updateDeposit('${deposit.id}')"/>
            <img class="delete-btn" src="img/trash.svg" 
                onclick="deleteDeposit('${deposit.id}')"/>
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
    const statusDD = document.querySelector("#status");
    const data = await lookupDataRepository.getLookupData("depositStatus");
    const statusOptions = data.depositStatus.map(s =>
            `<option value="${s}">${s}</option>`
    ).join(" ");
    statusDD.innerHTML = statusOptions;
}

function displayReasonSelect() {
    const statusDD = document.querySelector("#status");
    const returnArea = document.querySelectorAll(".returns");
    if (statusDD.value == "Cashed with Returns") {
        [].slice.call(returnArea).forEach(function (area) {
            area.innerHTML = `
            <p>Returned? </p>
            <input class="cbox" type="checkbox" onclick="fillReturnReasonsDD(this)">
            `;
        });
    } else {
        [].slice.call(returnArea).forEach(function (area) {
            area.innerHTML = ``;
        });
    }
}

async function fillReturnReasonsDD(cb) {
    if (cb.checked) {
        const reasonDiv = document.createElement("div");
        reasonDiv.className = "reasons";
        reasonDiv.innerHTML = `<select id="returnReason" name="returnReason"></select>`;
        cb.insertAdjacentElement("afterend", reasonDiv);
        const reasonSelect = reasonDiv.firstChild;
        console.log(reasonDiv);
        const data = await lookupDataRepository.getLookupData("returnReasons")
        const reasonOptions = data.returnReasons.map(reason =>
            `<option value="${reason}">${reason}</option>`
        );
        reasonSelect.innerHTML = reasonOptions.join(" ");
    } else {
        cb.nextElementSibling.remove();
    }
}

async function addDeposit(e) {
    e.preventDefault();
    const formData = formToObject(e.target);
    console.log(formData);
    const deposit = {
        id: formData.id,
        depositDate: formData.depositDate,
        bankAccountNo: formData.bankAccountNo,
        status: formData.status,
        chequeNos: includedChequeNos,
    };
    console.log("addDeposit", JSON.stringify(deposit));
    
    for (const chequeNo of includedChequeNos) {
        const cheque = await paymentRepo.getCheque(parseInt(chequeNo));
        if(formData.status === "Cashed with Returns")
            cheque.status = "Returned";
        else
            cheque.status = formData.status;
        await paymentRepo.updateCheque(cheque, parseInt(chequeNo));
    }
    if (isEdit) {
        await chequeDepositsRepo.updateDeposit(deposit);
        isEdit = false;
    } else {
        await chequeDepositsRepo.addDeposit(deposit);
    }
    includedChequeNos = [];
    await displayChequeDeposits();
    e.target.reset();
}

async function deleteDeposit(depositId) {
    const confirmed = confirm(`Are you sure you want to delete deposit #${depositId}?`);
    if (confirmed) {
        await chequeDepositsRepo.deleteDeposit(depositId);
        document.querySelector(`tr[data-deposit-id='${depositId}']`).remove();
    }
}

async function updateDeposit(depositId) {
    const deposit = await chequeDepositsRepo.getDeposit(depositId);
    await displayDepositCheques(deposit.chequeNos);
    document.querySelector("#id").value = deposit.id;
    document.querySelector("#depositDate").value = deposit.depositDate;
    document.querySelector("#bankAccountNo").value = deposit.bankAccountNo;
    document.querySelector("#status").value = deposit.status;
    isEdit = true;
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