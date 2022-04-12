import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

export const getId = () => uuidv4();
export const sumReducer = (accumulator, curr) => accumulator + curr;

export function displayCurrentUser() {
    // If the user is not logged in then redirect to the login page
    if (!sessionStorage.name) {
        window.location = "login.html";
    }
    const accountInfo = document.querySelector(".account-info");
    accountInfo.innerHTML = `
        <img class="profile-img" src="img/profile.png" alt="" />
        <span class="account-name">${sessionStorage.name}</span>`
}

export async function fetchJson(url) {
    const response = await fetch(url);
    return await response.json();
}

export async function fetchHtml(url) {
    const response = await fetch(url);
    return await response.text();
}

export function formToObject(form) {
    const formData = new FormData(form);
    const formObject = {};
    for (const [key, value] of formData) {
        formObject[key] = value;
    }
    return formObject;
}

export function getHeader(moduleTitle, moduleLogo) {
    return `
        <div class="header-card">
            <div class="icon-bg">
                <img src="img/${moduleLogo}" alt="" />
            </div>
            <h1 class="header-title">${moduleTitle}</h1>
        </div>
    `;
}

export function getFooter() {
    return `
     <p className="copyright">
        ⓒ 2022. G5-Fatma-Hadieh-Shayma rights reserved.
     </p>`
}

export function getSearchForm(searchLabel) {
    return `
     <form action="" class="search-form">
        <input
            type="text"
            class="search-box"
            placeholder='${searchLabel}'
            name="searchText"
        />
        <button type="submit" class="search-btn">
            Search
        </button>
     </form>
     <button class="add-btn">+ Add</button>
    `;
}

// e..g., 'Customers', 'customers.svg', 'Company name', 'customer-form.html'
export async function addCommonUIFragments(moduleTitle, moduleLogo, searchLabel, formUrl) {
    const navBar = document.querySelector(".nav-bar");
    navBar.innerHTML = await fetchHtml('nav-bar.html');

    const header = document.querySelector(".header");
    header.innerHTML = getHeader(moduleTitle, moduleLogo);

    const footer = document.querySelector(".footer");
    footer.innerHTML = getFooter();

    const searchSection = document.querySelector(".search-section");
    searchSection.innerHTML = getSearchForm(searchLabel);

    const popupForm = document.querySelector(".popup-form");
    popupForm.innerHTML = await fetchHtml(formUrl);

    displayCurrentUser();
}