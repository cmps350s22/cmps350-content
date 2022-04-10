import paymentRepo from "./repository/payment-repository";
import chequeDepositRepo from "./repository/cheque-deposit-repository";

let isEdit = false;
let chequeNos = [];

window.onload = async () => {
    generateAccount()
    await paymentRepo.initChequeDeposits();
    showChequeDepositData();
    showBankAccounts();
    showCounter();
    showAwaitingCheques();
    window.addToChequeNos = addToChequeNos;
    window.showReasons = showReasons;
    window.deleteDeposit = deleteDeposit;
    window.updateDeposit = updateDeposit;
};

const popupForm = document.querySelector(".popup-form");
const depositTable = document.querySelector(".table");
const searchForm = document.querySelector(".search");
const counter = document.querySelector(".counter");
const accountSelect = document.querySelector("#bank-account-no");
const chequeSelect = document.querySelector(".cheques-select");
const statusSelect = document.querySelector("#deposit-status");
document.querySelector("#deposit-date").value = new Date().toJSON().slice(0,10);
const accountInfo = document.querySelector(".account-info")


popupForm.addEventListener("submit", addDeposit);
statusSelect.addEventListener("change", showReasonSelect);
searchForm.addEventListener("submit", searchDeposits);


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
async function showAwaitingCheques() {
    const cheques = await paymentRepo.getCheques();
    const awaitingCheques = cheques.filter(
        (cheque) => cheque.status == "Awaiting"
    );
    console.log(awaitingCheques);
    const chequeForms = awaitingCheques
        .map((cheque) => chequeToForm(cheque))
        .join("");
    chequeSelect.innerHTML = `${chequeForms}`;
}

async function showCashedCheques(chequeNumbers) {
    const depositedCheques = [];
    for (const chequeNo of chequeNumbers) {
        const cheque = await paymentRepo.getCheque(parseInt(chequeNo));
        depositedCheques.push(cheque);
    }
    const chequeForms = depositedCheques
        .map((c) => chequeToForm(c))
        .join("");
    chequeSelect.innerHTML = `${chequeForms}`;
}

function chequeToForm(cheque) {
    return `
    <div class="cheque-card">
            <p for="chequeNo">Cheque No: ${cheque.chequeNo}</p>
            <p>Amount: ${cheque.amount}</p>
            <p>Status : ${cheque.status}</p>
            <p>Due Date : ${cheque.dueDate} <span class="daydiff">(${dateDifference(cheque.dueDate)})</span></p>
            <p>Include? </p>
            <input type="checkbox" class="cbox" onclick="addToChequeNos(this,'${cheque.chequeNo}')">
            <div class="returns"></div>
    </div>
    `;
}

function addToChequeNos(cb, chequeNo) {
    if (cb.checked === true) {
        chequeNos.push(chequeNo);
    } else if (cb.checked === false) {
        const index = chequeNos.indexOf(chequeNo);
        if (index > -1) {
            chequeNos.splice(index, 1);
        }
    }
}

async function showChequeDepositData() {
    showDepositStatus("add");
    const deposits = await chequeDepositRepo.getDeposits();
    // console.log(depsoits);
    const depositRows = await deposits
        .map((deposit) => depositToRow(deposit))
        .join(" ");
    depositTable.innerHTML = `
    <tr class="table-headings">
        <th>Deposit ID</th>
        <th>Deposit Date</th>
        <th>Bank Account Number</th>
        <th>Deposit Status</th>
        <th>Cheque Nos</th>
        <th></th>
    </tr>
    ${depositRows}`;
}

function depositToRow(deposit) {
    return `
    <tr class="table-row">
        <td>${deposit.depositId}</td>
        <td>${deposit.depositDate}</td>
        <td>${deposit.bankAccountNo}</td>
        <td>${deposit.depositStatus}</td>
        <td>${deposit.chequeNos.toString()}</td>
        <td class=editing-btns>
            <img class="edit-btn" src="img/pen.svg" onclick="updateDeposit('${
                deposit.depositId
            }')"/>
            <img class="delete-btn" src="img/trash.svg" onclick="deleteDeposit('${
                deposit.depositId
            }')"/>
        </td>
    </tr>
    `;
}

async function showBankAccounts() {
    const response = await fetch("YalaPay-data/bank-accounts.json");
    const data = await response.json();
    const accountOptions = data.map(
        (bankAcc) =>
            `<option value="${bankAcc.accountNo}">${bankAcc.bank} ${bankAcc.accountNo}</option>`
    );
    accountSelect.innerHTML = accountOptions.join(" ");
}

function showDepositStatus(func) {
    if (func == "add") {
        statusSelect.innerHTML = `
        <option value="Deposited">Deposited</option>
    `;
    } else if (func == "update") {
        statusSelect.innerHTML = `
        <option value="Cashed">Cashed</option>
        <option value="Cashed with Returns">Cashed with Returns</option>
        `;
    }
}

function showReasonSelect() {
    const returnArea = document.querySelectorAll(".returns");
    if (statusSelect.value == "Cashed with Returns") {
        [].slice.call(returnArea).forEach(function (area) {
            area.innerHTML = `
            <p>Returned? </p>
            <input class="cbox" type="checkbox" onclick="showReasons(this)">
            `;
        });
    } else {
        [].slice.call(returnArea).forEach(function (area) {
            area.innerHTML = ``;
        });
    }
}

async function showReasons(cb) {
    if (cb.checked) {
        const reasonDiv = document.createElement("div");
        reasonDiv.className = "reasons";
        reasonDiv.innerHTML = `<select id="returnReason" name="returnReason"></select>`;
        cb.insertAdjacentElement("afterend", reasonDiv);
        const reasonSelect = reasonDiv.firstChild;
        console.log(reasonDiv);
        const response = await fetch("YalaPay-data/return-reasons.json");
        const data = await response.json();
        const reasonOptions = data.map(
            (reason) => `<option value="${reason}">${reason}</option>`
        );
        reasonSelect.innerHTML = reasonOptions.join(" ");
    } else {
        cb.nextElementSibling.remove();
    }
}

async function addDeposit(e) {
    e.preventDefault();
    const data = formToObject(e.target);
    console.log(data);
    const deposit = {
        depositId: parseInt(data.depositId),
        depositDate: data.depositDate,
        bankAccountNo: data.bankAccountNo,
        depositStatus: data.status,
        chequeNos: chequeNos,
    };
    for (const chequeNo of chequeNos) {
        const cheque = await paymentRepo.getCheque(parseInt(chequeNo));
        if(data.status == "Cashed with Returns")
            cheque.status = "Returned";
        else
            cheque.status = data.status;
        await paymentRepo.updateCheque(cheque, parseInt(chequeNo));
    }
    if (isEdit) {
        deposit.depositId = parseInt(deposit.depositId);
        await chequeDepositRepo.updateDeposit(deposit);
        isEdit = false;
    } else {
        //assign the deposit ID
        const deposits = await chequeDepositRepo.getDeposits();
        deposit.depositId = deposits.length + 1;
        await chequeDepositRepo.addDeposit(deposit);
    }
    chequeNos = [];
    showDepositStatus("add");
    await showChequeDepositData();
    popupForm.reset();
}

async function deleteDeposit(depositId) {
    await chequeDepositRepo.deleteDeposit(parseInt(depositId));
    await showChequeDepositData();
}

async function updateDeposit(depositId) {
    showDepositStatus("update");
    const deposit = await chequeDepositRepo.getDeposit(parseInt(depositId));
    showCashedCheques(deposit.chequeNos);
    document.querySelector("#depositId").value = deposit.depositId;
    document.querySelector("#deposit-date").value = deposit.depositDate;
    document.querySelector("#bank-account-no").value = deposit.bankAccountNo;
    document.querySelector("#deposit-status").value = deposit.status;
    isEdit = true;
}

async function searchDeposits(e) {
    e.preventDefault();
    const searchInput = formToObject(e.target);
    console.log(searchInput);
    const deposit = await chequeDepositRepo.getDeposit(parseInt(searchInput.depositId));
    console.log(deposit);
    depositTable.innerHTML = `
    <tr class="table-headings">
        <th>Deposit ID</th>
        <th>Deposit Date</th>
        <th>Bank Account Number</th>
        <th>Deposit Status</th>
        <th>Cheque Nos</th>
        <th></th>
    </tr>
    ${depositToRow(deposit)}`;
}

async function showCounter() {
    const deposits = await chequeDepositRepo.getDeposits();
    const depositCount = deposits.length;
    counter.innerHTML = `${depositCount} <span class="counter-desc">Total Cheque Deposits</span>`;
}

function dateDifference(dueDateString) {
    const today = new Date();
    const dueDate = new Date(dueDateString);
    return Math.floor((dueDate - today) / (1000*60*60*24));
}

