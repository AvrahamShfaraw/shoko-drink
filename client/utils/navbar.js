import { store } from "../stores/store.js";
import { displayCart, updateCartCount } from "./cart.js";



export async function loadHeader() {
    try {
        const response = await fetch("../components/header/header.html");  // Load header.html file
        const html = await response.text();

        document.getElementById("header-container").innerHTML = html;

        if (store.commonStore.token) {
            await store.userStore.getUser().finally(() => store.commonStore.setAppLoaded());
        }

        store.commonStore.setAppLoaded(); // Mark app as loaded

        updateHeader(); // navbar updates
        updateCartCount(); // Update cart count

        document.querySelector("main").style.display = "block";


    } catch (error) {
        console.error("Error loading header:", error);
    }
}

// Update Header 
function updateHeader() {

    const menuToggle = document.getElementById("menu-toggle");
    const closeMenu = document.getElementById("close-menu");
    const navLinks = document.querySelector(".nav-links");
    const currentPage = window.location.pathname.split("/").pop(); // Get current filename
    const loginLink = document.getElementById("login-link");
    const registerLink = document.getElementById("register-link");
    const avatar = document.getElementById("user-avatar");
    const usernameSpan = document.getElementById("username-span");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const logoutBtn = document.getElementById("logout-btn");
    const manageProductsLink = document.getElementById("manage-products-link");
    const manageCetegoriesLink = document.getElementById("manage-categories-link");

    const loggedInUser = store.userStore.user;
    console.log(loggedInUser);

    document.getElementById("cart-link").addEventListener("click", () => {
        document.getElementById("side-cart").classList.add("show");
        displayCart();
    });

    document.getElementById("close-cart").addEventListener("click", () => {
        document.getElementById("side-cart").classList.remove("show");

    });


    // Set active class on the current page link
    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === currentPage);
    });

    // Toggle navigation menu for mobile
    menuToggle.addEventListener("click", () => navLinks?.classList.toggle("active"));

    // Close Menu
    closeMenu.addEventListener("click", function () {
        navLinks.classList.remove("active");
    });
    if (!loginLink || !registerLink || !dropdownMenu || !usernameSpan || !avatar) {

        console.warn("Navbar elements not found!");
        return;
    }



    if (loggedInUser) {
        avatar.classList.remove("hidden");
        usernameSpan.classList.remove("hidden");
        usernameSpan.textContent = loggedInUser.displayName;
        loginLink.classList.add("hidden");
        menuToggle?.classList.add("hidden");

        registerLink.classList.add("hidden");
        logoutBtn.classList.remove("hidden");
        logoutBtn.addEventListener("click", store.userStore.logout); // Use your existing function

        avatar.src = loggedInUser.image ? loggedInUser.image : '../assets/avatar.png ';


        if (loggedInUser.role === 0 && manageProductsLink && manageCetegoriesLink) {
            // Show link if the logged-in user is the seller
            manageProductsLink.classList.remove("hidden");
            manageProductsLink.href = `manage-products.html`;

            manageCetegoriesLink.classList.remove("hidden");
            manageCetegoriesLink.href="manage-categories.html"
        }

        // Handle avatar click to toggle dropdown visibility
        avatar.addEventListener("click", function () {
            dropdownMenu.classList.toggle("hidden");
        });


    } else {
        // Show login/register, hide user dropdown
        loginLink.classList.remove("hidden");
        registerLink.classList.remove("hidden");
        logoutBtn.classList.add("hidden");
        avatar.classList.add("hidden");
        usernameSpan.classList.add("hidden");
        dropdownMenu.classList.add("hidden");
        manageProductsLink.classList.add("hidden");
        manageCetegoriesLink.classList.add("hidden");


    }
}


