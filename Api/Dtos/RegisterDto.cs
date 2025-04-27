using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Dtos
{
    public class RegisterDto
    {
        [Required]
        [RegularExpression(@"^05\d{8}$", ErrorMessage = "Phone number must be in the format 05XXXXXXXX (10 digits).")]
        public string? PhoneNumber { get; set; }

        [Required]
        [EmailAddress(ErrorMessage = "Invalid email address format.")]
        public string? Email { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Display name must be between 2 and 50 characters.")]
        public string? DisplayName { get; set; }

        [Required]
        [Range(0, 1, ErrorMessage = "Role must be 0 (Manager) or 1 (Customer).")]
        public int Role { get; set; }


        public string? Image { get; set; }

    }
}