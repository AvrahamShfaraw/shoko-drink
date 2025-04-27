// Seed Data for Local Storage


import { Category } from '../models/category.js';
import { Product } from '../models/product.js';


// categories
const categories = [
    new Category(1, "וודקה"),
    new Category(2, "בירה"),
    new Category(3, "שתייה קלה"),
    new Category(4, "נשנושים"),
    new Category(5, "סיגריות וטבק"),
];

// products
const products = [
    new Product(1, "בלוגה 700 מ\"ל", 170, 1, "https://www.paneco.co.il/media/catalog/product/cache/723c292420af53b7186aedcaaff3fac4/0/0/0001451_-700-.jpg", 2),
    new Product(2, "רוסקי סטנדרט 700 מ\"ל", 75, 1, "https://www.paneco.co.il/media/catalog/product/cache/1170c7ba137a4ff58deca5f994bf29dd/0/0/000257055.jpg", 2),
    new Product(3, "ערק עלית", 70, 1, "https://www.paneco.co.il/media/catalog/product/cache/1170c7ba137a4ff58deca5f994bf29dd/0/0/0002824_-40-700-.jpeg", 2),
    new Product(4, "שישיית בירות היינקן", 40, 2, "https://www.paneco.co.il/media/catalog/product/cache/1170c7ba137a4ff58deca5f994bf29dd/0/0/0007453.jpg", 2),
    new Product(5, "שישיית גולדסטאר חצי ליטר", 40, 2, "https://www.paneco.co.il/media/catalog/product/cache/1170c7ba137a4ff58deca5f994bf29dd/0/0/0004915_-.jpg", 2),
    new Product(6, "שישיית משקה אנרגיה אקסל", 24, 3, "https://www.paneco.co.il/media/catalog/product/cache/1170c7ba137a4ff58deca5f994bf29dd/0/0/0006756_xl-.jpg", 2),
    new Product(7, "קרח", 10, 4, "https://www.eliasi.co.il/files/catalog/uploaded/G136681_3112020211244.png", 2),
];

// Seed data only if not already in localStorage
function seedData(key, data) {
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(data));
    }
}

// Seed all data
seedData("users", []);

// seedData("categories", categories);
// seedData("products", products);

seedData("orders", []);
seedData("orderProducts", []);

console.log("Seed data initialized.");
