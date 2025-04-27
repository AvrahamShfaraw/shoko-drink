using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Dtos
{
    public class ProductDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public decimal Price { get; set; }
        public Guid CategoryId { get; set; }
        public CategoryDto Category { get; set; } = new CategoryDto();// Includes category info
        public int Stock { get; set; }
        public string? Image { get; set; }
    }
}