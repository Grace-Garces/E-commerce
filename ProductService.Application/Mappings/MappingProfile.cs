using AutoMapper;
using ProductService.Application.DTOs;
using ProductService.Domain.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ProductService.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Mapeamento de Produto
        CreateMap<Product, ProductDto>().ReverseMap();
        CreateMap<CreateProductDto, Product>();
        CreateMap<UpdateProductDto, Product>();
    }
}
