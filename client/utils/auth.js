
import { LoginDto, RegisterDto } from "../models/user.js";
import { store } from "../stores/store.js";





// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDH85dthWvHmM0M0xaqMjpmjfPhAgObfHY",
    authDomain: "shokodrinkapp.firebaseapp.com",
    projectId: "shokodrinkapp",
    storageBucket: "shokodrinkapp.firebasestorage.app",
    messagingSenderId: "669866258447",
    appId: "1:669866258447:web:74a4c6a23402b4416b737a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


const { userStore } = store;
const { login, register, googleSignin } = userStore;

// google-signin
export async function googleSigninUser(phoneNumber) {


    try {

        const result = await signInWithPopup(auth, provider); // Await Google sign-in
        const userInfo = result.user; // Extract main user object
        const providerData = userInfo.providerData[0]; // Extract first provider's data

        if (!providerData) {
            console.error("No provider data found.");
            return;
        }

        // Create a new user instance

        const creds = new RegisterDto(
            providerData.email || "",
            providerData.displayName || "No Name",
            phoneNumber || providerData.phoneNumber || "Not Provided",
            providerData.photoURL || null,
        );

        console.log(creds);

        await googleSignin(creds);

        window.location.href = "index.html"; // Uncomment if needed
    } catch (error) {
        console.error("Google Sign-In Error:", error.message);
        alert("Failed to sign in with Google.");
    }
}

// Handle user registration
export async function registerUser(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const displayName = document.getElementById("displayName").value.trim();
    const phoneNumber = document.getElementById('phone-hidden').value.trim();

    const submitButton = document.getElementById('submit-btn');;
    const errorText = document.getElementById('error-text'); // Error message element

    // Clear previous error message
    errorText.textContent = '';
    errorText.style.color = '';
    errorText.style.textAlign = '';
    errorText.style.padding = '';



    // Simulate successful payment
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-button"></span>';

    // Create the Register DTO that matches backend expectations
    const creds = new RegisterDto(
        email,
        displayName,
        phoneNumber,
        null // init image property null 
    );

    try {
        // Calls userStore.register
        await register(creds);
        window.location.href = "index.html";

    } catch (error) {



        console.log("Registration error response data:", error.response?.data || error.message);

        // Re-enable the submit button
        submitButton.disabled = false;
        submitButton.innerHTML = 'יצירת חשבון'; // Reset button text

        // Display the error message from the server
        if (error.response && error.response.data) {
            errorText.textContent = error.response.data; // Error message from the server
        } else {
            errorText.textContent = 'An unexpected error occurred. Please try again.'; // Generic fallback error message
        }

        // Style the error message
        errorText.style.color = 'red';
        errorText.style.textAlign = 'center';
        errorText.style.padding = '10px';
        errorText.style.direction = 'rtl'; // Set direction to right-to-left


    }
}

// Handle user login
export async function loginUser(event) {
    event.preventDefault();

    let phoneNumber = document.getElementById("login-phone").value.trim();
    const phoneError = document.getElementById('phone-error'); // Error message element


    const errorText = document.getElementById('error-text'); // Error message element
    errorText.textContent = ''; // Clear any previous errors


    let submitButton = document.getElementById('submit-btn');; // Assuming the button is of type "submit"



    // Clear previous error message
    errorText.textContent = '';
    errorText.style.color = '';
    errorText.style.textAlign = '';
    errorText.style.padding = '';

    const phoneRegex = /^05\d{8}$/; // Ensures it starts with 05 and is exactly 10 digits

    // Validate the phone number
    if (!phoneRegex.test(phoneNumber)) {
        errorText.textContent = 'נא להזין מספר טלפון תקין, 10 ספרות בפורמט 05 XXXXXXXX';
        errorText.style.color = 'red';
        errorText.style.textAlign = 'center';
        errorText.style.padding = '10px';
        return; // Prevent form submission if the phone number is invalid
    }

    // Simulate successful payment
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-button"></span>';


    const creds = new LoginDto(
        phoneNumber,
    );

    try {
        await login(creds);
        window.location.href = "index.html";

    } catch (error) {

        console.log("Login error response data:", error.response?.data || error.message);

        // Re-enable the submit button
        submitButton.disabled = false;
        submitButton.innerHTML = 'כניסה'; // Reset button text

        // Display the error message from the server
        if (error.response && error.response.data) {
            errorText.textContent = error.response.data; // Error message from the server
        } else {
            errorText.textContent = 'An unexpected error occurred. Please try again.'; // Generic fallback error message
        }

        // Style the error message
        errorText.style.color = 'red';
        errorText.style.textAlign = 'center';
        errorText.style.padding = '10px';
        errorText.style.direction = 'rtl'; // Set direction to right-to-left
    }

}

