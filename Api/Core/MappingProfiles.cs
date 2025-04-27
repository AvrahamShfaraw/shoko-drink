using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Domain;
using Api.Dtos;
using AutoMapper;

namespace Api.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            // Map from Product to ProductDto
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category));  // Directly map Category object

            // Map from Category to CategoryDto
            CreateMap<Category, CategoryDto>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name)); // Ensure this mapping is correct

            CreateMap<UserApp, ProfileDto>()
                .ForMember(dest => dest.Image, opt => opt.MapFrom(opt => opt.Image.Url));


            // OrderProduct to OrderProductDto
            CreateMap<OrderProduct, OrderProductDto>()
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ProductId))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
                .ForMember(dest => dest.Product, opt => opt.MapFrom(src => src.Product));

            // Order to OrderDto
            CreateMap<Order, OrderDto>()
                .ForMember(dest => dest.Customer, opt => opt.MapFrom(src => src.Customer))
                .ForMember(dest => dest.Products, opt => opt.MapFrom(src => src.Products));


        }
    }
}