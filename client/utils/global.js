import { store } from "../stores/store.js";


// Get logged-in user
export function getLoggedInUser() {
    return store.userStore.user;
}


// A simple popup function
export function showPopup(message) {
    const popup = document.createElement('div');
    popup.classList.add("popup-alert")
    popup.dir = "rtl";
    popup.textContent = message;
   
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 2000); // disappear after 2 seconds
}