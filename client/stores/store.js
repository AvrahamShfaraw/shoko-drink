import { CategoryStore } from "./categoryStore.js";
import CommonStore from "./commonStore.js";
import { OrderStore } from "./orderStore.js";
import { ProductStore } from "./productStore.js";
import { UserStore } from "./userStore.js";


export const store = {
    userStore: new UserStore(),
    productStore: new ProductStore(),
    categoryStore: new CategoryStore(),
    commonStore: new CommonStore(),
    orderStore: new OrderStore()

}