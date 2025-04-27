import { loginUser } from "../utils/auth.js";
import { loadHeader } from "../utils/navbar.js";

document.addEventListener("DOMContentLoaded", async function () {

    await loadHeader();

});


document.getElementById("login-form").addEventListener("submit", async (e) => {

    await loginUser(e);

});


