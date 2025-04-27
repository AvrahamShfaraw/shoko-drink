import { loadHeader } from "../utils/navbar.js";
import { displayCategories, loadCategoriesData } from "../utils/category.js";
import { displayProducts, loadProductsData } from "../utils/product.js";


document.addEventListener("DOMContentLoaded", async () => {

    await loadHeader();
    await loadCategoriesData();
    displayCategories();
    await loadProductsData(); // Wait for products to load before displaying them
    displayProducts(); // Display products after the data has loaded



   
   
    let currentCategoryId = "all";
    let searchTerm = "";
    
    // Attach search event listener (no debounce)
    const searchInput = document.getElementById("product-search");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchTerm = e.target.value.trim().toLowerCase();
            console.log(searchTerm);
            displayProducts(currentCategoryId, searchTerm);
        });
    }
    


});

