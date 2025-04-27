import { UpdateUser } from "../models/user.js";
import { store } from "../stores/store.js";
import { loadHeader } from "../utils/navbar.js";

document.addEventListener("DOMContentLoaded", async function () {

    await loadHeader();

    const { userStore } = store;
    const { user, update } = userStore;



    // Fields to update
    const fields = ["email", "displayName", "phoneNumber"];
    // update usernameSpan avtar navbar
    const usernameSpan = document.getElementById("username-span");

    const profileImage = document.getElementById("profile-image");

    if (user && user.image) {
        profileImage.src = user.image;
    }

    fields.forEach(field => {
        const input = document.getElementById(field);
        input.value = user[field];
        input.style.textAlign = "right"; // Align text to the right
    });



    const accountForm = document.getElementById("account-form");

    accountForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form submission

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

        const updatedUser = new UpdateUser(
            document.getElementById("email").value,
            document.getElementById("displayName").value,
            document.getElementById("phoneNumber").value,

        );


        try {


            await update(updatedUser);

            usernameSpan.textContent = updatedUser.displayName;

            fields.forEach(field => {
                const input = document.getElementById(field);
                input.value = updatedUser[field];
                input.style.textAlign = "right"; // Align text to the right
            });

            submitButton.disabled = false;
            submitButton.innerHTML = 'עדכון פרטים'; // Reset button text


        } catch (error) {
            console.log(error);

            console.log("update error response data:", error.response?.data || error.message);

            // Re-enable the submit button
            submitButton.disabled = false;
            submitButton.innerHTML = 'עדכון פרטים'; // Reset button text

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

    });

});


