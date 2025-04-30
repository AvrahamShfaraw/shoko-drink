import axios from "https://cdn.jsdelivr.net/npm/axios@1.6.0/+esm";
import { store } from "../stores/store.js";


// https://shoko-drink-babcg9dmabfrdphw.israelcentral-01.azurewebsites.net/api/
// http://localhost:5000/api/
axios.defaults.baseURL = 'https://shoko-drink-babcg9dmabfrdphw.israelcentral-01.azurewebsites.net/api/';

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

axios.interceptors.request.use(
    config => {
        const token = store.commonStore.token;
        if (token && config)
            config.headers.Authorization = `Bearer ${token}`;
        return config;
    }
);

axios.interceptors.response.use(async (response) => {
    await sleep(500);

    return response.data;
}, (error) => {

    if (!error.response) {
        console.error("Network error or no response from server.");
        return Promise.reject(error);
    }
    const { data, status, config } = error.response;

    switch (status) {
        case 400:
            if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
                console.log("400");

            } else {
                console.log("400");
            }
            if (data.errors) {
                const modalStateError = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateError.push(data.errors[key]);
                        console.error(data.errors[key]);
                    }
                }
                throw modalStateError.flat();
            }
            else {
                console.log(data);
                console.error(data);
            }
            break;
        case 401:

            // router.navigate('/unauthorized');
            console.error('/unauthorized');
            break;
        case 403:

            console.error('/forbidden');
            break;
        case 404:
            console.error('/not-found');

            break;
        case 500:
            console.error('/server-error');

            break;
        default:
            break;

    }
    return Promise.reject(error);
});



const requests = {
    get: (url, params = {}) => axios.get(url, { params }),
    post: (url, data) => axios.post(url, data),
    put: (url, data) => axios.put(url, data),
    delete: (url) => axios.delete(url),
};


const Account = {
    current: () => requests.get('/account'),
    login: (user) => requests.post('/account/login', user),
    register: (user) => requests.post('/account/register', user),
    googleSignin: (user) => requests.post('/account/googleSignin', user),
    update: (user) => requests.post('/account/update', user),
}

const Categories = {
    list: () => requests.get('categories'),
    details: (id) => requests.get(`categories/${id}`, {}),
    create: (category) => requests.post('/categories', category),
    delete: (id) => requests.delete(`/categories/${id}`),
    update: (id, category) => requests.put(`/categories/${id}`, category)

}

const Products = {
    list: () => requests.get('products'),
    details: (id) => requests.get(`products/${id}`, {}),
    create: (product) => requests.post('products', product),
    update: (id, product) => requests.put(`products/${id}`, product),
    delete: (id) => requests.delete(`products/${id}`)
}


const Orders = {
    checkout: (pendingOrder) => requests.post('/orders/checkout', pendingOrder),
    list: () => requests.get('/orders'),
    details: (id) => requests.get(`/orders/${id}`),
    updateStatus: (order) => requests.put('/orders/status', order),
    delete: (id) => requests.delete(`/orders/${id}`)

};



const agent = {
    Account,
    Categories,
    Products,
    Orders

}

export default agent;