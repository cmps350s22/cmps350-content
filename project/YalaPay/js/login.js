import userRepo from "./repository/user-repository.js";

const loginForm = document.querySelector(".login-form");
loginForm.addEventListener("submit", login);

window.onload = async () => {
    userRepo.addUsers();
}

function formToObject(form) {
    const formData = new FormData(form);
    const formObject = {};
    for (const [key, value] of formData) {
        formObject[key] = value;
    }
    return formObject;
}

async function login(e) {
    e.preventDefault();
    const userLogin = formToObject(e.target);
    // Poorly done, login validation should be done by Indexed DB
    const user = await userRepo.getUser(userLogin.email);
    console.log(user);
    if (user.password == userLogin.password) {
        sessionStorage.setItem("name", `${user.firstName} ${user.lastName}`);
        window.location = "dashboard.html";
    } else {
        alert("Wrong email or password! \nPlease try again");
        loginForm.reset();
    }
}
