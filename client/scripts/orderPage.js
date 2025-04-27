import { loadHeader } from "../utils/navbar.js";
import { displayOrders, loadOrdersData } from "../utils/orders.js";

document.addEventListener("DOMContentLoaded", async () => {

    await loadHeader();
    await loadOrdersData(); // Wait for Orders to load before displaying them
    displayOrders();

})