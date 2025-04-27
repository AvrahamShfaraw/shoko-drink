import { store } from "../stores/store.js";
import { displayProducts } from "./product.js";


const categoryStore = store.categoryStore; // Get the product store instance
const { loadCategories, categoryRegistry, getCategoryList } = categoryStore; // destructuring


export async function loadCategoriesData() {
    if (categoryRegistry.size <= 1) {
        await loadCategories();
    } else {
        console.log("Categories already loaded.");
    }
}

// Get categories
export function getCategories() {
    return getCategoryList();
}

// Load categories 
export function displayCategories() {
    const categoriesContainer = document.getElementById("categories");
    if (!categoriesContainer) return;

    categoriesContainer.innerHTML = "";

    let categories = getCategories();

    // Function to generate category buttons
    function createCategoryButton(id, name) {
        let button = document.createElement("button");
        button.textContent = name;
        button.classList.add("category-button");
        button.dataset.categoryId = id;

        // Add click event
        button.onclick = () => {
            document.querySelectorAll(".category-button").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            filterProducts(id);
        };

        return button;
    }

    // Add "All" button and make it active by default
    const allButton = createCategoryButton("all", "הכל");
    allButton.classList.add("active"); // Set the "All" button as active by default
    categoriesContainer.appendChild(allButton);

    // Add category buttons 
    categories.forEach(category => {
        categoriesContainer.appendChild(createCategoryButton(category.id, category.name));
    });
}

// Function to handle category selection
function filterProducts(categoryId) {
    displayProducts(categoryId);
}
