using AutoMapper;
using ProductService.Application.DTOs;
using ProductService.Application.Exceptions;
using ProductService.Application.Interfaces;
using ProductService.Domain.Entities;
using ProductService.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductService.Application.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    public ProductService(IProductRepository productRepository, IMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync(string? searchTerm, string? departmentCode)
    {
        var products = await _productRepository.SearchAsync(searchTerm, departmentCode);
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }

    public async Task<ProductDto?> GetProductByIdAsync(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return _mapper.Map<ProductDto?>(product);
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto productDto)
    {
        var existingProduct = await _productRepository.GetByCodeAsync(productDto.Code);
        if (existingProduct != null)
        {
            throw new DuplicateProductCodeException(productDto.Code);
        }

        var product = _mapper.Map<Product>(productDto);
        product.Id = Guid.NewGuid();
        product.CreatedAt = DateTime.UtcNow;

        await _productRepository.AddAsync(product);
        return _mapper.Map<ProductDto>(product);
    }

    public async Task<bool> UpdateProductAsync(Guid id, UpdateProductDto productDto)
    {
        var existingProduct = await _productRepository.GetByIdAsync(id);
        if (existingProduct is null) return false;

        _mapper.Map(productDto, existingProduct);
        existingProduct.UpdatedAt = DateTime.UtcNow;

        await _productRepository.UpdateAsync(existingProduct);
        return true;
    }

    public async Task<bool> DeleteProductAsync(Guid id)
    {
        var existingProduct = await _productRepository.GetByIdAsync(id);
        if (existingProduct is null) return false;

        await _productRepository.DeleteAsync(id);
        return true;
    }
}
