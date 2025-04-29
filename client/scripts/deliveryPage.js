import { getLoggedInUser } from "../utils/global.js";
import { loadHeader } from "../utils/navbar.js";
import { getOrders, loadOrdersData } from "../utils/orders.js";

document.addEventListener("DOMContentLoaded", async function () {
    await loadHeader();
    await loadOrdersData();

    let orders = getOrders();

    const user = getLoggedInUser();
    const userId = user.phoneNumber;

    const userOrders = orders.filter(order => order.customer.phoneNumber === userId);
    const lastAddressDiv = document.getElementById("last-address-option");

    function normalizeAddress(address) {
        return address
            .replace(/\s+/g, ' ')  // Replace multiple spaces with one space
            .replace(/,/g, '')     // Remove commas
            .trim()
            .toLowerCase();        // Make lowercase
    }
    
    if (userOrders.length > 0) {
        userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
        const seen = new Set();
        const uniqueAddresses = [];
    
        userOrders.forEach(order => {
            const normalized = normalizeAddress(order.address);
            if (!seen.has(normalized)) {
                seen.add(normalized);
                uniqueAddresses.push(order.address); // Keep original address formatting
            }
        });
    
        uniqueAddresses.forEach(address => {
            const lastAddressButton = document.createElement("button");
            lastAddressButton.textContent = address;
            lastAddressButton.classList.add("category-button");
            lastAddressButton.style.display = "block";
    
            lastAddressDiv.appendChild(lastAddressButton);
    
            lastAddressButton.addEventListener("click", () => {
                let pendingOrder = JSON.parse(localStorage.getItem("pendingOrder"));
                if (!pendingOrder) {
                    window.location.href = `cart.html`;
                }
                pendingOrder.address = address;
                localStorage.setItem("pendingOrder", JSON.stringify(pendingOrder));
    
                window.location.href = "payment.html";
            });
        });
    

    }
    

    const deliveryForm = document.getElementById("delivery-form");
    deliveryForm.style.display = "block";

    // Check if the continue button exists
    const continueButton = document.getElementById("continue-button");
    const errorText = document.getElementById("error-text"); // Error message element

    // Clear previous error message
    if (errorText) {
        errorText.textContent = '';
        errorText.style.color = '';
        errorText.style.textAlign = '';
        errorText.style.padding = '';
    }

    // Reusable function for setting error message styling
    function setErrorMessage(message) {
        errorText.style.color = 'red';
        errorText.style.textAlign = 'center';
        errorText.style.padding = '10px';
        errorText.style.direction = 'rtl'; // Right-to-left text direction
        errorText.textContent = message;
        errorText.style.display = "block";
    }

    if (!continueButton) {
        console.error("❌ Continue button not found!");
        return;
    }

    continueButton.addEventListener("click", function () {
        let pendingOrder = JSON.parse(localStorage.getItem("pendingOrder"));

        if (!pendingOrder) {
            // If there's no pending order, redirect to cart
            window.location.href = `cart.html`;
            return;
        }

        // Collect form data
        const address = document.getElementById("address").value.trim();
        const entrance = document.getElementById("entrance").value.trim();
        const floor = document.getElementById("floor").value.trim();
        const apartment = document.getElementById("apartment").value.trim();

        // Form validation
        if (!address || !floor || !apartment || !entrance) {
            setErrorMessage("נא למלא את כל השדות.");
            return;
        } else if (!/^\d*$/.test(floor)) { // Ensure floor is numeric
            setErrorMessage("הקומה לא תקינה.");
            return;
        } else if (!/^\d*$/.test(apartment)) { // Ensure apartment number is numeric
            setErrorMessage("מספר הדירה לא תקין.");
            return;
        } else {
            // Clear any previous error messages and proceed if valid
            errorText.style.display = "none";

            // Save the address as a string to the pending order's address
            pendingOrder.address = `${address}, כניסה: ${entrance}, קומה: ${floor}, דירה: ${apartment}`;
            localStorage.setItem("pendingOrder", JSON.stringify(pendingOrder));

            // Redirect to the payment page
            window.location.href = `payment.html`;
        }
    });
});
