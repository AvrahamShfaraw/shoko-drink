import { store } from "../stores/store.js";
import { loadHeader } from "../utils/navbar.js";

const { orderStore, userStore } = store;  // Destructure the orderStore from the store object
const { checkout } = orderStore;


document.addEventListener("DOMContentLoaded", async function () {
    await loadHeader();


    let pendingOrder = JSON.parse(localStorage.getItem("pendingOrder"));
    let cart = JSON.parse(localStorage.getItem("cart"));

    document.getElementById("orders-list").dir = "rtl";

    if (!pendingOrder) {
        alert("No Order Products found! Redirecting to cart...");
        window.location.href = "index.html";
        return;
    }
    if (!cart) {
        alert("No Products found! Redirecting to home...");
        window.location.href = "index.html";
        return;
    }

    console.log(cart);
    const productsList = document.getElementById("order");

    if (cart && cart.length > 0) {
        // Clear first
        productsList.innerHTML = `
        <div id="address-details">
            <h3>פרטי הכתובת</h3>
            <span id="address"></span>
        </div>
        <div id="products-list">
            <h3>פרטי המוצרים</h3>
            <ul id="products-ul"></ul>
        </div>
    `;

        const productsUl = document.getElementById("products-ul");

        cart.forEach(product => {
            const li = document.createElement("li");
            li.style.display = "flex";
            li.style.alignItems = "center";
            li.style.marginBottom = "8px";

            li.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="order-product-image">
            <div>
                <div><strong>${product.name}</strong></div>
                <div>₪${product.price} × ${product.quantity}</div>
            </div>
        `;
            productsUl.appendChild(li);
        });

        pendingOrder.cart = cart;
    }

    // Display the address details
    const addressDetails = document.getElementById("address-details");
    if (pendingOrder.address) {
        addressDetails.innerHTML += pendingOrder.address;
    }


    // Handle the payment button click
    document.getElementById("action-btn").addEventListener("click", async function () {
        let payButton = document.getElementById('action-btn');
        payButton.disabled = true;
        payButton.innerHTML = '<span class="spinner-button"></span>';

        try {
            // Use the orderStore to checkout
            const checkoutResult = await checkout(pendingOrder);
            // clear the pending order and cart after successful checkout
            localStorage.removeItem("pendingOrder");
            localStorage.setItem("cart", JSON.stringify([]));

            pendingOrder.orderId = checkoutResult;

            // Send the email confirmation
            await sendOrderConfirmationEmailCustomer(pendingOrder);
            await sendAdminNotificationEmailTeam(pendingOrder);


            window.location.href = `https://avrahamshfaraw.github.io/shoko-drink/client/pages/orderDetails.html?orderId=${pendingOrder.orderId}`;


        } catch (error) {
            console.error(error);
            payButton.disabled = false;
            payButton.innerHTML = 'לשלם';
        }
    });
});

// Function to send an order confirmation email to the customer
async function sendOrderConfirmationEmailCustomer(pendingOrder) {
    const user = userStore.user;

    const templateParams = {
        name: user.displayName,
        email: user.email,
        orderId: pendingOrder.orderId,
        total: pendingOrder.totalPrice,
        orders: pendingOrder.cart?.map(item => ({
            name: item.name,
            units: item.quantity,
            price: item.price
        })) || []
    };

    try {
        // Sending the email via EmailJS
        const response = await emailjs.send('service_trnjjrq', 'template_nm7hsvs', templateParams);
        console.log('Order confirmation email sent successfully to customer:', response.status, response.text);
    } catch (error) {
        console.error('Error sending order confirmation email to customer:', error);
    }
}



// Function to send a notification email to the app's internal team
async function sendAdminNotificationEmailTeam(pendingOrder) {

    const templateParams = {
        orderId: pendingOrder.orderId,
        total: pendingOrder.totalPrice,
    };


    try {
        // Sending the email to the admin via EmailJS
        const response = await emailjs.send('service_trnjjrq', 'template_fu1y5u6', templateParams);
        console.log('Admin Notification Email sent successfully:', response);
    } catch (error) {
        console.error('Error sending admin notification email:', error);
    }
}
