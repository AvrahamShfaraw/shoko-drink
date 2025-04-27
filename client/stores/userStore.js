import agent from "../api/agent.js";
import { store } from "./store.js";

export class UserStore {

    constructor() {
        this.user = null;
    }

    get isLoggedIn() {
        return !!this.user;
    }

    login = async (creds) => {

        try {
            const user = await agent.Account.login(creds);
            store.commonStore.setToken(user.token);
            this.user = user;

        } catch (error) {
            throw error;
        }
    }


    logout = () => {
        store.commonStore.setToken(null);
        window.localStorage.removeItem('jwt');
        this.user = null;

        window.location.href = "index.html";

    }

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            this.user = user;
        } catch (error) {
            console.log(error)
        }
    }

    register = async (creds) => {
        try {

            const user = await agent.Account.register(creds);
            store.commonStore.setToken(user.token);
            this.user = user;
        } catch (error) {
            throw error;
        }
    }

    googleSignin = async (creds) => {
        try {

            const user = await agent.Account.googleSignin(creds);
            store.commonStore.setToken(user.token);
            this.user = user;
        } catch (error) {
            throw error;
        }
    }

    update = async (creds) => {
        try {

            const updateUser = await agent.Account.update(creds);
            store.commonStore.setToken(updateUser.token);
            this.user = updateUser;


        } catch (error) {
            throw error;
        }
    }
    setImage = (image) => {

        if (this.user) this.user.image = image;

    }




}