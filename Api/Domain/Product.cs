using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Domain
{
    public class Product
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public decimal Price { get; set; }
        public Guid CategoryId { get; set; }
        public Category? Category { get; set; }
        public int Stock { get; set; }
        public string? Image { get; set; }

        public List<OrderProduct> OrderProducts { get; set; } = new();

    }
}