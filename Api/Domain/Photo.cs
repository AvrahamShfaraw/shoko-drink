using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Domain
{
    public class Photo
    {
        public string? Id { get; set; } 
        public string? Url { get; set; } 
        public bool IsMain { get; set; }

    }
}