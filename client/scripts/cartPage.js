import { displayCart } from "../utils/cart.js";
import { loadHeader } from "../utils/navbar.js";

document.addEventListener("DOMContentLoaded", async () => {


    await loadHeader();
    displayCart();

});