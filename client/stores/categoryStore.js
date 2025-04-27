import agent from "../api/agent.js";


export class CategoryStore {

    constructor() {
        this.categoryRegistry = new Map();
        this.loading = false;
        this.error = null;

    }


    setLoadingInitial = (state) => {
        this.loading = state;
    };

    // Load all categories
    loadCategories = async () => {
        this.setLoadingInitial(true);
        console.log("Loading categories...");

        const spinner = document.getElementById("spinner-categories");
        const categoryContainer = document.getElementById("categories");

        // for index.html
        if (spinner) {
            spinner.style.display = "block";

        }

        // for index.html
        if (categoryContainer) {
            categoryContainer.innerHTML = "";

        }


        try {
            const result = await agent.Categories.list();
            result.forEach((category) => {
                this.setCategory(category);
            });

        } catch (error) {
            console.log(error);
            this.error = "Failed to load categories";

        } finally {
            this.setLoadingInitial(false);
            // for index.html
            if (spinner) {
                spinner.style.display = "none";

            }

        }
    };


    setCategory = (category) => {

        this.categoryRegistry.set(category.id, category);
    };

    // Get a category by id from the registry
    getCategory = (id) => {
        return this.categoryRegistry.get(id);
    };



    // Get the list of categories
    getCategoryList = () => {
        return Array.from(this.categoryRegistry.values());
    }

}