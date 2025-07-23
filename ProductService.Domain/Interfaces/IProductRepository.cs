using ProductService.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductService.Domain.Interfaces;

public interface IProductRepository
{
    Task<IEnumerable<Product>> SearchAsync(string? searchTerm, string? departmentCode);
    Task<Product?> GetByIdAsync(Guid id);
    Task<Product?> GetByCodeAsync(string code);
    Task AddAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteAsync(Guid id); // Exclusão lógica
}