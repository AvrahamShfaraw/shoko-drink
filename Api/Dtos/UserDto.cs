using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Dtos
{
    public class UserDto
    {
        
        public string? PhoneNumber { get; set; } 
        public int Role { get; set; }
        public string? Token { get; set; } 
        public string? DisplayName { get; set; } 
        public string? Email { get; set; } 
        public string? Image { get; set; } 




    }
}