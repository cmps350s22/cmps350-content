import paymentRepo from "./repository/payment-repository";
import invoiceRepo from "./repository/invoice-repository";
import customerRepo from "./repository/customer-repository";

let isEdit = false;
let oldChequeNo = 0;

window.onload = async () => {
    generateAccount();
    await paymentRepo.initPayments();
    await paymentRepo.initCheques();
    await showPaymentData();
    await showInvoiceInfo();
    showPaymentModes();
    window.deletePayment = deletePayment;
    window.updatePayment = updatePayment;
};

const popupForm = document.querySelector(".popup-form");
const paymentTable = document.querySelector(".table");
const searchForm = document.querySelector(".search");
const invoiceInfo = document.querySelector(".invoiceinfo");
const customerInfo = document.querySelector(".custinfo");
const paymentSelect = document.querySelector("#payment-mode");
const moreDetails = document.querySelector(".moreDetails");
const accountInfo = document.querySelector(".account-info")

popupForm.addEventListener("submit", addPayment);
searchForm.addEventListener("submit", searchPayments);
paymentSelect.addEventListener("change", showMoreDetails);


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

async function showPaymentData() {
    const sessionInvoice = sessionStorage.getItem("invoiceNo");
    const payments = await paymentRepo.getPayments();
    // console.log(payments);
    const paymentsOfInvoice = payments.filter(
        (payment) => payment.invoiceNo == sessionInvoice
    );
    console.log(paymentsOfInvoice);
    const paymentRows = paymentsOfInvoice
        .map((payment) => paymentToRow(payment))
        .join(" ");
    paymentTable.innerHTML = `
    <tr class="table-headings">
      <th>Payment ID</th>
      <th>Invoice No</th>
      <th>Amount</th>
      <th>Payment Date</th>
      <th>Payment Mode</th>
      <th>Cheque No</th>
      <th> </th>
    </tr>
    ${paymentRows}`;
}

function paymentToRow(payment) {
    return `
    <tr class="table-row">
        <td>${payment.paymentId}</td>
        <td>${payment.invoiceNo}</td>
        <td>${payment.amount}</td>
        <td>${payment.paymentDate}</td>
        <td>${payment.paymentMode}</td>
        <td>${payment.chequeNo}</td>
        <td class=editing-btns>
            <img class="edit-btn" src="img/pen.svg" onclick="updatePayment('${payment.paymentId}')"/>
            <img class="delete-btn" src="img/trash.svg" onclick="deletePayment('${payment.paymentId}')"/>
        </td>
    </tr>
    `;
}

async function showPaymentModes() {
    const response = await fetch("YalaPay-data/payment-modes.json");
    const data = await response.json();
    const paymentOptions = data.map(
        (paymentMode) =>
            `<option value="${paymentMode}">${paymentMode}</option>`
    );
    paymentSelect.innerHTML = paymentOptions.join(" ");
}

function showMoreDetails() {
    if (paymentSelect.value == "Cheque") {
        moreDetails.innerHTML = `
        <div class="chequeNo-select">
                            <label for="chequeNo">Cheque No</label><br />
                            <input
                                type="number"
                                id="chequeNo"
                                name="chequeNo"
                                min="0"
                                required
                            />
                        </div>
                        <div class="drawer-select">
                            <label for="drawer">Drawer</label>
                            <input type="text" name="drawer" id="drawer" required/>
                        </div>
                        <div class="bank-select">
                            <label for="bankName">Drawer Bank</label><br />
                            <select
                                id="bank-name"
                                name="bankName"
                                required
                            ></select>
                        </div>
                        <div class="bank-status-select">
                            <label for="status">Status</label><br />
                            <select id="status" name="status" required>
                                <option value="Awaiting">Awaiting</option>
                                <option value="Deposited">Deposited</option>
                                <option value="Cashed">Cashed</option>
                                <option value="Returned">Returned</option>
                            </select>
                        </div>
                        <div class="received-date-select">
                            <label for="received-date">Received Date</label
                            ><br />
                            <input
                                type="date"
                                id="received-date"
                                name="receivedDate"
                                required
                            />
                        </div>
                        <div class="due-date-select">
                            <label for="due-date">Due Date</label
                            ><br />
                            <input
                                type="date"
                                id="due-date"
                                name="dueDate"
                                required
                            />
                        </div>
                        <div class="cheque-image-select">
                            <label for="chequeImageUri">Cheque Image</label>
                            <input type="file" id="cheque-image" name="chequeImageUri" accept="image/*">
                        </div>
        `;
    } else {
        moreDetails.innerHTML = ``;
    }
    showBankNames();
}

async function showBankNames() {
    const bankSelect = document.querySelector("#bank-name");
    const response = await fetch("YalaPay-data/banks.json");
    const data = await response.json();
    const banksOptions = data.map(
        (bankName) => `<option value="${bankName}">${bankName}</option>`
    );
    bankSelect.innerHTML = banksOptions.join(" ");
}

async function addPayment(e) {
    e.preventDefault();
    const sessionInvoice = sessionStorage.getItem("invoiceNo");
    if (paymentSelect.value == "Cheque") {
        const data = formToObject(e.target);
        console.log(data);
        const payment = {
            paymentId: parseInt(data.paymentId),
            invoiceNo: parseInt(sessionInvoice),
            amount: parseInt(data.amount),
            paymentDate: data.paymentDate,
            paymentMode: "Cheque",
            chequeNo: data.chequeNo,
        };
        const cheque = {
            chequeNo: parseInt(data.chequeNo),
            amount: parseInt(data.amount),
            drawer: data.drawer,
            bankName: data.bankName,
            status: data.status,
            receivedDate: data.receivedDate,
            dueDate: data.dueDate,
            chequeImageUri: data.chequeImageUri.name,
        };

        if (isEdit) {
            await paymentRepo.updatePayment(payment);
            await paymentRepo.updateCheque(cheque, oldChequeNo);
            isEdit = false;
        } else {
            const payments = await paymentRepo.getPayments();
            payment.paymentId = payments.length + 1;
            await paymentRepo.addPayment(payment);
            await paymentRepo.addCheque(cheque);
        }
    } else {
        const payment = formToObject(e.target);
        payment.invoiceNo = parseInt(sessionInvoice);
        payment.amount = parseInt(payment.amount);
        if (isEdit) {
            payment.paymentId = parseInt(payment.paymentId);
            await paymentRepo.updatePayment(payment);
            isEdit = false;
        } else {
            const payments = await paymentRepo.getPayments();
            payment.paymentId = payments.length + 1;
            await paymentRepo.addPayment(payment);
        }
    }

    await showPaymentData();
    popupForm.reset();
}

async function searchPayments(e) {
    e.preventDefault();
    const searchInput = formToObject(e.target);
    console.log(searchInput);
    const payment = await paymentRepo.getPayment(parseInt(searchInput.paymentId));
    const sessionInvoice = sessionStorage.getItem("invoiceNo");
    if (payment.invoiceNo != sessionInvoice) {
        paymentTable.innerHTML = `
        <tr class="table-headings">
      <th>Payment ID</th>
      <th>Invoice No</th>
      <th>Amount</th>
      <th>Payment Date</th>
      <th>Payment Mode </th>
      <th>Cheque No</th>
      <th>        </th>
    </tr>
    <tr><td>Not Found</td></tr>
        `;
    } else {
        paymentTable.innerHTML = `
    <tr class="table-headings">
      <th>Payment ID</th>
      <th>Invoice No</th>
      <th>Amount</th>
      <th>Payment Date</th>
      <th>Payment Mode </th>
      <th>Cheque No</th>
      <th>        </th>
    </tr>
    ${paymentToRow(payment)}`;
    }
}

async function deletePayment(paymentID) {
    if (paymentSelect.value == "Cheque") {
        const payment = await paymentRepo.getPayment(paymentID);
        await paymentRepo.deleteCheque(payment.chequeNo);
    }
    await paymentRepo.deletePayment(parseInt(paymentID));
    await showPaymentData();
}

async function updatePayment(paymentID) {
    isEdit = true;
    const payment = await paymentRepo.getPayment(parseInt(paymentID));
    document.querySelector("#payment-id").value = payment.paymentId;
    document.querySelector("#invoiceNo").value = payment.invoiceNo;
    document.querySelector("#amount").value = payment.amount;
    document.querySelector("#payment-date").value = payment.paymentDate;
    document.querySelector("#payment-mode").value = payment.paymentMode;
    showMoreDetails();
    if (paymentSelect.value == "Cheque") {
        const cheque = await paymentRepo.getCheque(parseInt(payment.chequeNo));
        oldChequeNo = cheque.chequeNo;
        document.querySelector("#chequeNo").value = cheque.chequeNo;
        document.querySelector("#drawer").value = cheque.drawer;
        document.querySelector("#bank-name").value = cheque.bankName;
        document.querySelector("#status").value = cheque.status;
        document.querySelector("#received-date").value = cheque.receivedDate;
        document.querySelector("#due-date").value = cheque.dueDate;
        document.querySelector("#cheque-image").value = cheque.chequeImageUri;
    }
}

async function showInvoiceInfo() {
    const sessionInvoice = sessionStorage.getItem("invoiceNo");
    const invoice = await invoiceRepo.getInvoice(parseInt(sessionInvoice));
    showCustomerInfo(invoice.customerId);
    invoiceInfo.innerHTML = `
    <h3>Invoice Details</h3>
                    <p>Invoice No:</p>
                    <span>${invoice.invoiceNo}</span>
                    <p>Amount:</p>
                    <span>${invoice.amount}</span>
                    <p>Invoice Date:</p>
                    <span>${invoice.invoiceDate}</span>
                    <p>Due Date:</p>
                    <span>${invoice.dueDate}</span>
    `;
}

async function showCustomerInfo(customerId) {
    const customer = await customerRepo.getCustomer(customerId);
    customerInfo.innerHTML = `
    <h3>Customer Details</h3>
                    <p>Customer ID:</p>
                    <span>${customer.customerId}</span>
                    <p>Company Name:</p>
                    <span>${customer.companyName}</span>
                    <p>Address:</p>
                    <span>${customerAddress(customer.address)}</span>
                    <p>Contact Name:</p>
                    <span>${customer.contactDetails.firstName} ${
        customer.contactDetails.lastName
    }</span>
                    <p>Email:</p>
                    <span>${customer.contactDetails.email}</span>
                    <p>Phone:</p>
                    <span>${customer.contactDetails.mobile}</span>
    `;
}

function customerAddress(address) {
    return `${address.street}, ${address.city}, ${address.country}`;
}
