using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Dtos
{
    public class LoginDto
    {
        [Required]
        [RegularExpression(@"^05\d{8}$", ErrorMessage = "Phone number must be in the format 05XXXXXXXX (10 digits).")]
        public string PhoneNumber { get; set; } = string.Empty;
    }
}