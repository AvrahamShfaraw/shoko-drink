import { loadHeader } from "../utils/navbar.js";
import { displayOrderDetails } from "../utils/orders.js";


document.addEventListener("DOMContentLoaded", async () => {
    await loadHeader();
    await displayOrderDetails();
});
