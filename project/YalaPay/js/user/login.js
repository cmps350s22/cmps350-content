import userRepo from "./user-repository.js";
import customerRepo from "../customer/customer-repository.js";
import invoiceRepo from "../invoice/invoice-repository.js";
import paymentRepo from "../payment/payment-repository.js";
import chequeDepositsRepo from "../deposit/cheque-deposit-repository.js";
import lookupDataRepository from "../common/lookup-data-repository.js";
import { formToObject } from "../common/common.js"

const loginForm = document.querySelector(".login-form");
loginForm.addEventListener("submit", login);

// Insert test data into DB if the database is empty
window.onload = async () => {
    await userRepo.initUsers();
    await customerRepo.initCustomers();
    await invoiceRepo.initInvoices();
    await paymentRepo.initPayments();
    await paymentRepo.initCheques();
    await chequeDepositsRepo.initChequeDeposits();
    await lookupDataRepository.initLookupData();
}

async function login(e) {
    e.preventDefault();
    const userLogin = formToObject(e.target);
    // Poorly done, login validation should be done by Indexed DB
    const user = await userRepo.getUser(userLogin.email, userLogin.password);
    console.log(user);
    if (user) {
        sessionStorage.setItem("name", `${user.firstName} ${user.lastName}`);
        window.location = "index.html";
    } else {
        alert("Wrong email or password! \nPlease try again");
        loginForm.reset();
    }
}
