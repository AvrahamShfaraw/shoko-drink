import { Product } from "../models/product.js";
import { store } from "../stores/store.js";
import { addToCart } from "./cart.js";
import { getCategories, loadCategoriesData } from "./category.js";
import { getLoggedInUser } from "./global.js";


import { v4 as uuidv4 } from 'https://unpkg.com/uuid@8.3.2/dist/esm-browser/index.js';


const productStore = store.productStore; // Get the product store instance
const { loadProducts, getProductList, productRegistry, create, update, deleteProduct } = productStore; // destructuring


// Load products only if not already loaded
export async function loadProductsData() {
    if (productRegistry.size <= 1) {
        await loadProducts();
    } else {
        console.log("Products already loaded.");
    }
}

// Get products
export function getProducts() {
    return getProductList();
}

// Display products filtered by category (default: show all)
export function displayProducts(categoryId = "all", searchTerm = "") {

    const productsContainer = document.getElementById("products");
    if (!productsContainer) return;



    let products = getProducts();
    if (categoryId !== "all") {
        products = products.filter(p => p.categoryId === categoryId);
    }


    if (searchTerm) {
        products = products.filter(p =>
            p.name.toLowerCase().includes(searchTerm)
        );
    }

    productsContainer.innerHTML = "";

    if (products.length > 0) {
        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            productCard.innerHTML = `
                <img src="${product.image}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">₪${product.price}</p>
                    <button class="add-to-cart-btn ${product.stock <= 0 ? 'out-of-stock' : ''}" 
                        data-product-id="${product.id}" 
                        ${product.stock <= 0 ? 'disabled' : ''}>
                        ${product.stock <= 0 ? 'אזל מהמלאי' : 'הוסף לסל'}
                    </button>
                </div>
            `;

            productsContainer.appendChild(productCard);
        });

        // Attach event listeners after rendering all products
        document.querySelectorAll(".add-to-cart-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                const productId = event.target.getAttribute("data-product-id");
                addToCart(productId, categoryId);
            });
        });

    } else {
        productsContainer.innerHTML = `<p>אין מוצרים להצגה</p>`;
    }
}
// Manage Products 
export function displayManageProducts() {

    const userManager = getLoggedInUser();



    if (!userManager) {
        document.location.href = "https://avrahamshfaraw.github.io/shoko-drink/client/pages/index.html";

    }

    // handle Open Create Modal
    const createProductButton = document.getElementById("create-product-button");
    if (createProductButton) {
        document.getElementById("create-product-button").addEventListener("click", function () {
            openProductModal();
        });
    }



    const manageProductsContainer = document.getElementById("manage-products-container");
    manageProductsContainer.dir = "rtl";
    if (!manageProductsContainer) {
        return;
    }

    const totalProductsContainer = document.getElementById("total-products");




    // Get Products
    const products = getProducts();




    manageProductsContainer.innerHTML = '';
    if (!userManager || userManager.role !== 0) {
         document.location.href = "https://avrahamshfaraw.github.io/shoko-drink/client/pages/index.html";

    }

    totalProductsContainer.innerHTML = `<h3>(<strong>${products.length}</strong>)</h3>`;

    if (!products.length > 0) {
        manageProductsContainer.innerHTML = `<p>אין מוצרים לניהול עדיין.</p>`;

    } else {
        products.forEach(product => {



            const productCard = document.createElement("div");
            productCard.classList.add("cart-item");
            productCard.innerHTML = `
              
                
                <div style="display: flex; align-items: center; justify-content:space-between">
                    <div class='product-actions'> 
                    <button class="remove-from-cart" id="edit-product-${product.id}">
                        <img src="../assets/edit.svg" alt="Edit" class="action-icon">
                    </button>
                    
                    <button class="remove-from-cart" id="delete-product-${product.id}">
                        <img src="../assets/delete.svg" alt="Delete" class="action-icon">
                        <span class="spinner-delete-button" style="display: none; "></span>
                    </button>                      
                    </div>

                    <div class='product-stock'>                  
                        <span style="color: ${product.stock <= 0 ? 'red' : 'green'}">
                            <strong >
                                ${product.stock}
                            </strong> - זמין במלאי
                        </span>            
                    </div> 
                </div>
                   
                  <li>
                    <div class="item-left">
                        <img src="${product.image}" alt="${product.name}" class="order-product-image">
                        <div class="item-info">
                        <div><strong>${product.name}</strong></div>
                        <div>₪${product.price}</div>
                        </div>
                    </div>
                </li>  
            `;

            manageProductsContainer.appendChild(productCard);


            // Add event listeners for edit and delete buttons
            document.getElementById(`edit-product-${product.id}`).addEventListener("click", function () {
                openProductModal(true, product.id);
            });



            document.getElementById(`delete-product-${product.id}`).addEventListener("click", async function () {
                const deleteBtn = this;
                const imageBtn = this;
                const image = imageBtn.querySelector(".action-icon")
                const spinner = deleteBtn.querySelector(".spinner-delete-button");


                // hidde delete image
                image.style.display = "none";
                // Show spinner and disable button
                spinner.style.display = "inline-block";
                deleteBtn.disabled = true;

                try {
                    await deleteProductHandler(product.id); // Wait for deletion to complete
                    displayManageProducts(); // Re-render the updated product list
                } catch (error) {
                    console.error("Error deleting product:", error);
                }
            });


        });


    }

}

// Open Modal for Create or Edit
async function openProductModal(edit = false, productId = null) {

    //GET ELEMENT

    const modalTitle = document.getElementById("modalTitle");
    const productIdInput = document.getElementById("productId");
    const productNameInput = document.getElementById("productName");
    const productPriceInput = document.getElementById("productPrice");
    const productImageInput = document.getElementById("productImageUrl");
    const productCategorySelect = document.getElementById("productCategory");
    const imagePreview = document.getElementById("imagePreview");
    const productStock = document.getElementById("productStock");




    productCategorySelect.innerHTML = ''; // Clear existing options

    const categories = getCategories();
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        productCategorySelect.appendChild(option);
    });


    let products = getProducts();

    if (edit) {




        let product = products.find(p => p.id === productId);

        if (!product) return alert("המוצר לא נמצא!");

        // Display the current properties
        modalTitle.innerText = "עריכת מוצר";
        productIdInput.value = product.id;
        productNameInput.value = product.name;
        productPriceInput.value = product.price;
        productCategorySelect.value = product.categoryId;
        productImageInput.value = product.image;

        if (product.image) {
            // show it as preview
            imagePreview.src = product.image;
            imagePreview.style.display = "block";




        } else {
            // If no image is set, hide preview
            imagePreview.style.display = "none";
        }

        productStock.value = product.stock;


    } else {



        // Hide image preview Reste & Clear Inputs
        modalTitle.innerText = "הוספת מוצר";
        productIdInput.value = "";
        productNameInput.value = "";
        productPriceInput.value = 0;
        productCategorySelect.value = "";
        productImageInput.value = "";
        productStock.value = 0
        imagePreview.style.display = "none";


    }

    document.getElementById("productModal").style.display = "flex";
}

// Handle Product Form Create or Edit 
document.getElementById("productForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const productId = document.getElementById("productId").value.trim();
    const name = document.getElementById("productName").value.trim();
    const price = Number(document.getElementById("productPrice").value);
    const categoryId = document.getElementById("productCategory").value;
    const image = document.getElementById("productImageUrl").value.trim() || null;
    const stock = Number(document.getElementById("productStock").value);

    if (productId) {

        let actionButton = document.getElementById('action-btn');

        actionButton.disabled = true;
        actionButton.innerHTML = '<span class="spinner-button"></span>';
        // Update existing product
        const updatedProduct = new Product(productId, name, price, categoryId, image, stock);
        try {
            await update(updatedProduct);

            actionButton.disabled = false;
            actionButton.innerHTML = 'שמור';

        } catch (error) {
            console.error("Error updating product:", error);
            actionButton.disabled = false;
            actionButton.innerHTML = 'שמור';
        }

    } else {

        let actionButton = document.getElementById('action-btn');

        actionButton.disabled = true;
        actionButton.innerHTML = '<span class="spinner-button"></span>';
        // Create new product (uuidv4 generate id)
        const newProduct = new Product(uuidv4(), name, price, categoryId, image, stock);
        try {
            await create(newProduct);
            actionButton.disabled = false;
            actionButton.innerHTML = 'שמור';
        } catch (error) {
            console.error("Error creating product:", error);
            actionButton.disabled = false;
            actionButton.innerHTML = 'שמור';
        }
    }

    // Close modal and refresh product list
    document.getElementById("productModal").style.display = "none";
    displayManageProducts();
});


// When the user types/pastes an image URL, the preview updates immediately
document.getElementById("productImageUrl")?.addEventListener("input", function () {
    const imagePreview = document.getElementById("imagePreview");
    if (!imagePreview) return;

    const imageUrlInput = this.value.trim();

    if (imageUrlInput !== "") {
        imagePreview.src = imageUrlInput;
        imagePreview.style.display = "block";
    } else {
        imagePreview.style.display = "none";
    }
});

// Close Modal
document.getElementById("close-modal")?.addEventListener("click", () => {
    document.getElementById("productModal").style.display = "none";
});

async function deleteProductHandler(productId) {

    try {

        // Call the delete function from the store
        await deleteProduct(productId);



        console.log("Product deleted successfully");

    } catch (error) {
        console.error("Error deleting product:", error);
    }
}