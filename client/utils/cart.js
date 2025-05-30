import { Order } from "../models/order.js";
import { OrderProduct } from "../models/orderProduct.js";
import { getLoggedInUser, showPopup } from "./global.js";
import { displayProducts, getProducts } from "./product.js";

// Get cart items
export function getCart() {


    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Add item to cart
export function addToCart(productId, categoryId) {

    let cart = getCart();
    let products = getProducts();

    let product = products.find(p => p.id === productId);


    if (!product) {
        showPopup("מוצר לא נמצא.");
        return;
    }


    // Check if the product has enough stock
    if (product.stock <= 0) {
        showPopup("מצטערים, מוצר זה אזל מהמלאי!");
        return;
    }


    let existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {

        // Update the product quantity in the cart
        existingItem.quantity += 1;

    } else {

        cart.push({
            productId, quantity: 1,
            name: product.name,
            price: product.price,
            image: product.image,

        });
    }

    // Update the product stock in the products array
    product.stock -= 1;
    // Store the updated cart and products back in localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Optionally, you can display a message to the user
    showPopup("המוצר נוסף לעגלה!");

    updateCartCount();
    displayProducts(categoryId);

}

// Remove item from cart
export function removeFromCart(productId) {
    let cart = getCart();
    let products = getProducts();
    let product = products.find(p => p.id === productId);

    // Find the item in the cart with the given productId
    const cartItem = cart.find(p => p.productId === productId);

    if (cartItem) {
        // Increase the product stock by the quantity in the cart
        if (product) {
            product.stock += cartItem.quantity;
        }

        // Remove the item from the cart
        cart = cart.filter(p => p.productId !== productId);

        // Save updated data
        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem("products", JSON.stringify(products)); // Make sure to update products if stored
    }

    displayCart();
    updateCartCount();
    showPopup("המוצר הוסר מהעגלה!");
    displayProducts();
}

export function updateCartCount() {
    const cartCountSpan = document.getElementById("cart-count");
    let cartItems = getCart();

    let itemCount = cartItems.reduce((total, item) => total + item.quantity, 0); // Sum of all item quantities

    if (itemCount >= 0) {
        cartCountSpan.textContent = itemCount;
        cartCountSpan.classList.remove("hidden"); // Show badge
    } else {
        cartCountSpan.classList.add("hidden"); // Hide if empty
    }
}


// Display cart items
export function displayCart() {
    let cartContainer = document.getElementById("cart-items");
    let cart = getCart();

    cartContainer.innerHTML = "";
    cartContainer.dir = "rtl";

    if (!cart.length > 0) {
        cartContainer.innerHTML = `<p>עגלת קניות ריקה</p`;
        document.getElementById("checkout").classList.add("out-of-stock")


    } else {
        document.getElementById("checkout").classList.remove("out-of-stock")

        cart.forEach(product => {
            const orderCard = document.createElement("div");
            orderCard.classList.add("cart-item");
            orderCard.innerHTML = `
            
                <li>
                    <div class="item-left">
                        <img src="${product.image}" alt="${product.name}" class="order-product-image">
                        <div class="item-info">
                        <div><strong>${product.name}</strong></div>
                        <div>₪${product.price} × ${product.quantity}</div>
                        </div>
                    </div>
                    <button class="remove-from-cart" id="remove-from-cart-${product.productId}">הסר</button>
                </li>
                         
            `;

            cartContainer.appendChild(orderCard);

            // Add 'onclick' handler directly inside the 'loadCart' function
            document.getElementById(`remove-from-cart-${product.productId}`).onclick = function () {
                removeFromCart(product.productId);
            };

        });
    }

    document.getElementById("cart-total").textContent = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById("checkout").onclick = function () {
        checkout();
    }
}

// Checkout then Go To Delivery info
function checkout() {
    let products = getProducts();
    let cart = getCart();

    if (cart.length === 0) {
        showPopup("עגלת קניות ריקה.");
        return;
    }

    let userId = getLoggedInUser()?.phoneNumber || null;
    if (!userId) {
        showPopup("בצע כניסה כדי לבצע הזמנה!");
        return;
    }

    // בדיקת מלאי
    for (let item of cart) {
        let product = products.find(p => p.id === item.productId);
        if (!product) {
            showPopup(`מוצר בשם ${item.name} לא נמצא.`);
            
            return; // עצור, לא להמשיך
        }
        if (product.stock < item.quantity) {
            showPopup(`המוצר "${product.name}" לא קיים בכמות המבוקשת במלאי.`);
            return; // עצור, לא להמשיך
        }
    }

    // אם הכל תקין - להמשיך

    // Convert cart items into OrderProduct objects
    let orderProducts = cart.map(item => new OrderProduct(item.productId, item.quantity));

    // Calculate total price
    let totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create Order object
    const order = new Order({ totalPrice, address: "", products: orderProducts });

    // Store order temporarily
    localStorage.setItem("pendingOrder", JSON.stringify(order));

    // Redirect
    window.location.href = `delivery.html`;
}


