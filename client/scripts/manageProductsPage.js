import { loadCategoriesData } from "../utils/category.js";
import { loadHeader } from "../utils/navbar.js";
import { displayManageProducts, loadProductsData } from "../utils/product.js";

document.addEventListener("DOMContentLoaded", async function () {
    await loadHeader();

    await loadProductsData(); // Wait for products to load before displaying them
    displayManageProducts();

    await loadCategoriesData();

})
