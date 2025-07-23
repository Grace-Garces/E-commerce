using ProductService.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllProductsAsync(string? searchTerm, string? departmentCode);
    Task<ProductDto?> GetProductByIdAsync(Guid id);
    Task<ProductDto> CreateProductAsync(CreateProductDto productDto);
    Task<bool> UpdateProductAsync(Guid id, UpdateProductDto productDto);
    Task<bool> DeleteProductAsync(Guid id);
}
