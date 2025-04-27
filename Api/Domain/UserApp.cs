using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Domain
{
    public class UserApp
    {
        public string Id { get; set; } = Guid.NewGuid().ToString(); // Correct way to set a default value
        public string? Email { get; set; }
        public string? DisplayName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ImageId { get; set; }
        public Photo? Image { get; set; } 
        public int Role { get; set; } // 0 for seller, 1 for customer
    }
}