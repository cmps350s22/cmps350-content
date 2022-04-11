import customerRepo from "./customer-repository.js";
import {
    addCommonUIFragments,
    formToObject
} from "../common/common.js"
let isEdit = false;

document.addEventListener("DOMContentLoaded", async () => {
    // Load and inject common html fragments (to avoid redundancy)
    await addCommonUIFragments('Customers', 'customers.svg', 'Company name', 'customer-form.html');

    await displayCustomers();
    window.deleteCustomer = deleteCustomer;
    window.updateCustomer = updateCustomer;

    const searchForm = document.querySelector(".search-form");
    const popupForm = document.querySelector(".popup-form");

    searchForm.addEventListener("submit", searchCustomer);
    popupForm.addEventListener("submit", addCustomer);
});

function getTableHeader() {
    return `<tr class="table-headings">
        <th>Customer Id</th>
            <th>Company Name</th>
            <th>Address</th>
            <th>Contact Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th> </th>
    </tr>`
}

async function displayCustomers() {
    const customers = await customerRepo.getCustomers();
    //console.log(customers);
    customersToHtmlTable(customers);
}

function customersToHtmlTable(customers) {
    const mainContent = document.querySelector(".main-content");
    const customerRows = customers
        .map((customer) => customerToHTMLRow(customer))
        .join(" ");

    mainContent.innerHTML = `
        <table class="table">
            ${getTableHeader()}  
            ${customerRows}
        </table>
    `;
}

function customerToHTMLRow(customer) {
    return `
    <tr class="table-row" data-customer-id='${customer.id}'>
        <td>${customer.id}</td>
        <td>${customer.companyName}</td>
        <td>${customerAddress(customer.address)}</td>
        <td>${customer.contactDetails.firstName} ${
        customer.contactDetails.lastName
    }</td>
        <td>${customer.contactDetails.email}</td>
        <td>${customer.contactDetails.mobile}</td>
        <td class=editing-btns>
            <img class="edit-btn" src="img/pen.svg" 
                onclick="updateCustomer('${customer.id}')"/>
            <img class="delete-btn" src="img/trash.svg" 
                onclick="deleteCustomer('${customer.id}')"/>
        </td>
    </tr>
    `;
}

function customerAddress(address) {
    return `${address.street}, ${address.city}, ${address.country}`;
}

async function addCustomer(e) {
    e.preventDefault();
    const formData = formToObject(e.target);
    const customer = {
        id: formData.id,
        companyName: formData.companyName,
        address: {
            street: formData.street,
            city: formData.city,
            country: formData.country,
        },
        contactDetails: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            mobile: formData.mobile,
        }
    };
    if (isEdit) {
        await customerRepo.updateCustomer(customer);
        isEdit = false;
    } else {
        await customerRepo.addCustomer(customer);
    }

    await displayCustomers();
    e.target.reset();
}

async function deleteCustomer(customerId) {
    const confirmed = confirm(`Are you sure you want to delete customer #${customerId}?`);
    if (confirmed) {
        await customerRepo.deleteCustomer(customerId);
        document.querySelector(`tr[data-customer-id='${customerId}']`).remove();
    }
}

async function updateCustomer(customerId) {
    const customer = await customerRepo.getCustomer(customerId);
    document.querySelector("#id").value = customer.id;
    document.querySelector("#companyName").value = customer.companyName;
    document.querySelector("#street").value = customer.address.street;
    document.querySelector("#city").value = customer.address.city;
    document.querySelector("#country").value = customer.address.country;
    document.querySelector("#firstName").value =
        customer.contactDetails.firstName;
    document.querySelector("#lastName").value =
        customer.contactDetails.lastName;
    document.querySelector("#email").value = customer.contactDetails.email;
    document.querySelector("#mobile").value = customer.contactDetails.mobile;
    isEdit = true;
}

async function searchCustomer(e) {
    e.preventDefault();
    const searchInput = formToObject(e.target);
    const customer = await customerRepo.getCustomerByName(searchInput.searchText);
    if (customer) {
        //console.log(customer);
        customersToHtmlTable([ customer ]);
    } else {
        alert("No data found");
    }
}