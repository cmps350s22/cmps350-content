import userRepo from "./repository/user-repository.js";
import { formToObject } from "./common.js"

const loginForm = document.querySelector(".login-form");
loginForm.addEventListener("submit", login);

window.onload = async () => {
    await userRepo.initUsers();
}

async function login(e) {
    e.preventDefault();
    const userLogin = formToObject(e.target);
    // Poorly done, login validation should be done by Indexed DB
    const user = await userRepo.getUser(userLogin.email, userLogin.password);
    console.log(user);
    if (user) {
        sessionStorage.setItem("name", `${user.firstName} ${user.lastName}`);
        window.location = "dashboard.html";
    } else {
        alert("Wrong email or password! \nPlease try again");
        loginForm.reset();
    }
}
