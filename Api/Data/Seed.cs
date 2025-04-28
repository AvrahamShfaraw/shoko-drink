using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Domain;

namespace Api.Data
{
    public class Seed
    {
        public static async Task SeedData(DataContext context)
        {
            // Check if the database is created

            if (!context.Products.Any() && !context.Users.Any())
            {
                var usersApp = new List<UserApp>
                {
                    new UserApp {  Id  = Guid.NewGuid().ToString() ,Email = "seller1@example.com", DisplayName = "חיים מולו", PhoneNumber = "0515951409", Role = 0 }, // Seller
                    new UserApp {  Id  = Guid.NewGuid().ToString(),Email = "customer1@example.com", DisplayName = "Customer 1", PhoneNumber = "0503456789", Role =1 }, // Customer
                    new UserApp { Id  = Guid.NewGuid().ToString(),Email = "customer2@example.com", DisplayName = "Customer 2", PhoneNumber = "0504567890", Role =1 }  // Customer
                };


                var user1Photo = new Photo
                {
                    Id = Guid.NewGuid().ToString(),
                    Url = "https://res.cloudinary.com/avraham/image/upload/v1745831967/Screenshot_2025-04-28_121841_hvic3y.png",
                    IsMain = true
                };


                usersApp[0].Image = user1Photo;

                var categories = new List<Category>
                {
                    new Category { Name = "וודקה" },
                    new Category { Name = "בירה" },
                    new Category { Name = "שתייה קלה" },
                    new Category { Name = "נשנושים" },
                    new Category { Name = "סיגריות וטבק" }
                };


                var products = new List<Product>
                {
                    new Product
                    {
                        Name = "בלוגה 700 מ\"ל",
                        Price = 170,
                        Category = categories[0],
                        Image = "https://www.paneco.co.il/media/catalog/product/cache/723c292420af53b7186aedcaaff3fac4/0/0/0001451_-700-.jpg",
                        Stock = 2
                    },
                    new Product
                    {
                        Name = "רוסקי סטנדרט 700 מ\"ל",
                        Price = 75,
                        Category = categories[0],
                        Image = "https://www.paneco.co.il/media/catalog/product/cache/1170c7ba137a4ff58deca5f994bf29dd/0/0/000257055.jpg",
                        Stock = 2
                    },
                    new Product
                    {
                        Name = "ערק עלית",
                        Price = 70,
                        Category = categories[0],
                        Image = "https://www.paneco.co.il/media/catalog/product/cache/1170c7ba137a4ff58deca5f994bf29dd/0/0/0002824_-40-700-.jpeg",
                        Stock = 2
                    },
                    new Product
                    {
                        Name = "שישיית בירות היינקן",
                        Price = 40,
                        Category = categories[1],
                        Image = "https://www.paneco.co.il/media/catalog/product/cache/1170c7ba137a4ff58deca5f994bf29dd/0/0/0007453.jpg",
                        Stock = 2
                    },
                    new Product
                    {
                        Name = "שישיית גולדסטאר חצי ליטר",
                        Price = 40,
                        Category = categories[1],
                        Image = "https://www.paneco.co.il/media/catalog/product/cache/1170c7ba137a4ff58deca5f994bf29dd/0/0/0004915_-.jpg",
                        Stock = 2
                    },
                    new Product
                    {
                        Name = "שישיית משקה אנרגיה אקסל",
                        Price = 24,
                        Category = categories[2],
                        Image = "https://www.paneco.co.il/media/catalog/product/cache/1170c7ba137a4ff58deca5f994bf29dd/0/0/0006756_xl-.jpg",
                        Stock = 2
                    },
                    new Product
                    {
                        Name = "קרח",
                        Price = 10,
                        Category = categories[3],
                        Image = "https://www.eliasi.co.il/files/catalog/uploaded/G136681_3112020211244.png",
                        Stock = 2
                    }
                };


                await context.Users.AddRangeAsync(usersApp);
                await context.Categories.AddRangeAsync(categories);
                await context.Products.AddRangeAsync(products);
                await context.SaveChangesAsync();


                // Seed orders
                var customer1 = usersApp.First(u => u.Email == "customer1@example.com");

                var orders = new List<Order>
                {
                    new Order
                    {
                        CustomerId = customer1.Id,
                        Customer = customer1,
                        Address = "Tel Aviv, Dizengoff 123",
                        Status = "בטיפול",
                        Date = DateTime.UtcNow,
                        TotalPrice = 245, // 170 + 75
                        Products = new List<OrderProduct>
                        {
                            new OrderProduct { Product = products[0], Quantity = 1, ProductId = products[0].Id },
                            new OrderProduct { Product = products[1], Quantity = 1, ProductId = products[1].Id }
                        }
                    }
                };

                await context.Orders.AddRangeAsync(orders);

                await context.SaveChangesAsync();



            }
        }
    }
}