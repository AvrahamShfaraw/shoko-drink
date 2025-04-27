import agent from "../api/agent.js";

export class ProductStore {

    constructor() {
        this.productRegistry = new Map();
        this.loading = false;
        this.error = null;
    }

    setLoadingInitial = (state) => {
        this.loading = state;
    };

    // Load all products
    loadProducts = async () => {
        this.setLoadingInitial(true);
        console.log("Loading products...");

        const spinner = document.getElementById("spinner-products");
        const productsContainer = document.getElementById("products");
        const productsManagerContainer = document.getElementById("manage-products-container");


        spinner.style.display = "block";
        if (productsContainer) {
            productsContainer.innerHTML = "";

        }

        if (productsManagerContainer) {
            productsManagerContainer.innerHTML = "";

        }


        try {
            const result = await agent.Products.list();
            result.forEach((product) => {
                this.setProduct(product);
            });

        } catch (error) {
            console.log(error);
            this.error = "Failed to load products";

        } finally {
            this.setLoadingInitial(false);
            spinner.style.display = "none";
        }
    };


    setProduct = (product) => {

        this.productRegistry.set(product.id, product);
    };

    // Get a product by id from the registry
    getProducts = (id) => {
        return this.productRegistry.get(id);
    };

    create = async (product) => {
        this.setLoadingInitial(true);
        console.log("create Product")
        try {
            const created = await agent.Products.create(product);
            console.log(product);

            this.productRegistry.set(product.id, product);
            this.setLoadingInitial(false);

        } catch (error) {
            console.error("Failed to create product", error);
            this.setLoadingInitial(false)
            throw error;
        }
    };

    update = async (updateProduct) => {
        this.setLoadingInitial(true);
        console.log("update Product")
        try {
            const updated = await agent.Products.update(updateProduct.id, updateProduct);
            console.log(updated);
            this.productRegistry.set(updateProduct.id, updateProduct);
            this.setLoadingInitial(false);

        } catch (error) {
            console.error("Failed to update product", error);
            this.setLoadingInitial(false);
            throw error;
        }
    };

    deleteProduct = async (id) => {
        this.setLoadingInitial(true);
        console.log("delete Product...");

        try {

            await agent.Products.delete(id)
            this.productRegistry.delete(id);
            this.setLoadingInitial(false);
            console.log("deleted Product...");

        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
            throw error;

        }
    };

    // Get the list of products
    getProductList = () => {
        return Array.from(this.productRegistry.values());
    }

}