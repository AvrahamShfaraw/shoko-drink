export default class CommonStore {


    constructor() {
        this.token = window.localStorage.getItem("jwt");
        this.error = null;
    }

    // Set token and save to localStorage
    setToken = (token) => {
        this.token = token;
        if (token) {
            window.localStorage.setItem("jwt", token);
        } else {
            window.localStorage.removeItem("jwt");
        }
    }

    // Set error
    setServerError = (error) => {
        this.error = error;
    }

    // Mark app as loaded
    setAppLoaded = () => {


        const spinner = document.getElementById("spinner-app-container");
        if (spinner) spinner.style.display = "none"; // Hide the loading spinner

        console.log('App loaded.');
    }





}