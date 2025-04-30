import agent from "../api/agent.js";

export class OrderStore {

    constructor() {
        this.orderRegistry = new Map(); // to store orders by their IDs
        this.loading = false;
        this.error = null;
    }

    // Set loading state for initial load
    setLoadingInitial = (state) => {
        this.loading = state;
    };

    // Load all orders
    loadOrders = async () => {
        this.setLoadingInitial(true);
        console.log("Loading orders...");

        const spinner = document.getElementById("spinner-products");
        const ordersList = document.getElementById("orders-list");


        spinner.style.display = "block";
        if (ordersList) {
            ordersList.innerHTML = "";

        }


        try {
            const result = await agent.Orders.list();
            result.forEach((order) => {
                this.setOrder(order); // Store each order in the registry
            });

        } catch (error) {
            console.log(error);
            this.error = "Failed to load orders";

        } finally {
            this.setLoadingInitial(false);
            spinner.style.display = "none";

        }
    };


    loadOrder = async (orderId) => {

        const spinner = document.getElementById("spinner-products");
        const ordersList = document.getElementById("orders-list");


        if (ordersList) {
            ordersList.innerHTML = "";

        }

        spinner.style.display = "block";

        let order = this.orderRegistry.get(orderId);
        if (order) {

            spinner.style.display ="none";
            return order;
        }

        try {
            const fetchedOrder = await agent.Orders.details(orderId); // API call

            this.orderRegistry.set(fetchedOrder.id, fetchedOrder);
            spinner.style.display = "none";


            return fetchedOrder;
        } catch (error) {
            console.error("Failed to load order", error);
            spinner.style.display = "none";

            return null;
        }
    }
    // Set a single order in the registry
    setOrder = (order) => {
        this.orderRegistry.set(order.id, order);
    };

    // Get an order by ID from the registry
    getOrder = (id) => {
        return this.orderRegistry.get(id);
    };

    // Delete an order by ID
    deleteOrder = async (id) => {
        this.setLoadingInitial(true);
        console.log("Deleting order...");

        try {
            await agent.Orders.delete(id); // assuming an API endpoint to delete orders
            this.orderRegistry.delete(id); // Remove the order from the registry
            console.log("Deleted order...");
        } catch (error) {
            console.log(error);
            this.error = "Failed to delete order";
        } finally {
            this.setLoadingInitial(false);
        }
    };

    // Get the list of all orders
    getOrderList = () => {
        return Array.from(this.orderRegistry.values());
    };

    checkout = async (pendingOrder) => {
        this.setLoadingInitial(true);
        console.log("Checking out order...");

        try {
            const result = await agent.Orders.checkout(pendingOrder);
            console.log("Checkout successful:", result);

            return result; // Return the checkout result (e.g., confirmation, etc.)

        } catch (error) {
            console.log(error);
            this.error = "Failed to checkout order";
            throw error;
        } finally {
            this.setLoadingInitial(false);
        }
    };

    updateStatus1 = async (updateOrder) => {

        try {

            const response = await agent.Orders.updateStatus(updateOrder);

            const order = this.orderRegistry.get(updateOrder.id);
            console.log(order, response);
            if (order) {
                order.status = updateOrder.status;
                this.orderRegistry.set(order.id, order); // update registry
            }

            return response;

        } catch (error) {
            console.log(error);
        }
    };

    updateStatus = async (updateOrder) => {
        try {
            const response = await agent.Orders.updateStatus(updateOrder);

            const order = this.orderRegistry.get(updateOrder.id);
            if (order && response) {
                order.status = updateOrder.status;
                this.orderRegistry.set(order.id, order); // Update local cache
            }

            console.log(order);


        } catch (error) {
            console.error("Failed to update status:", error);
            throw error; // Let the caller handle it
        }
    };

    // Set error state
    setError = (error) => {
        this.error = error;
    };


    // Set error state
    setError = (error) => {
        this.error = error;
    };

}
