import { googleSigninUser, registerUser } from "../utils/auth.js";
import { loadHeader } from "../utils/navbar.js";


document.addEventListener("DOMContentLoaded", async function () {

    await loadHeader();

});


document.getElementById('register-form-step-1').addEventListener('submit', (e) => {
    e.preventDefault();

    const phoneInput = document.getElementById('phoneNumber');
    const phoneNumber = phoneInput.value.trim();
    const phoneError = document.getElementById('phone-error'); // Error message element

    // Improved phone number validation for Israeli numbers
    const phoneRegex = /^05\d{8}$/; // Ensures it starts with 05 and is exactly 10 digits

    if (phoneRegex.test(phoneNumber)) {
        document.getElementById('register-form-step-1').style.display = 'none';
        document.getElementById('register-form-step-2').style.display = 'flex';
        document.getElementById('google-signin-container').style.display = 'flex';

        // Store phone number in the hidden input field
        document.getElementById('phone-hidden').value = phoneNumber;
        phoneError.textContent = ''; // Clear any previous errors
    } else {
        phoneError.textContent = 'נא להזין מספר טלפון תקין, 10 ספרות בפורמט 05 XXXXXXXX';
        phoneError.style.color = 'red';
        phoneError.style.textAlign = 'center';
        phoneError.style.padding = '10px'


    }
});


document.getElementById("register-form-step-2").addEventListener("submit", async (e) => {

    await registerUser(e);
});


document.getElementById("google-signin-button").addEventListener("click", async () => {

    const phoneNumber = document.getElementById('phone-hidden').value;

    if (phoneNumber && phoneNumber.length >= 10) { // Basic phone number validation

        await googleSigninUser(phoneNumber);


    } else {
        alert('נא להזין מספר טלפון תקין');
        document.getElementById('register-form-step-1').style.display = 'flex';
        document.getElementById('register-form-step-2').style.display = 'none';
        document.getElementById('google-signin-container').style.display = 'none';


    }

});



