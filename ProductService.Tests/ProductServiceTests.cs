using AutoMapper;
using Moq;
using ProductService.Application.DTOs;
using ProductService.Application.Exceptions;
using ProductService.Application.Services;
using ProductService.Domain.Entities;
using ProductService.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;

namespace ProductService.Tests;

public class ProductServiceTests
{
    private readonly Mock<IProductRepository> _productRepositoryMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly ProductService.Application.Services.ProductService _productService;

    public ProductServiceTests()
    {
        _productRepositoryMock = new Mock<IProductRepository>();
        _mapperMock = new Mock<IMapper>();
        _productService = new ProductService.Application.Services.ProductService(_productRepositoryMock.Object, _mapperMock.Object);
    }

    private List<Product> GetSampleProducts()
    {
        return new List<Product>
        {
            new Product { Id = Guid.NewGuid(), Code = "001", Description = "Produto A" },
            new Product { Id = Guid.NewGuid(), Code = "002", Description = "Produto B" }
        };
    }

    [Fact]
    public async Task GetAllProductsAsync_ShouldCallSearchAsyncAndReturnDtos()
    {
        // Arrange
        var products = GetSampleProducts();
        var productDtos = products.Select(p => new ProductDto { Id = p.Id, Code = p.Code, Description = p.Description }).ToList();
        
        // Corrigido: O mock agora configura o método SearchAsync, que é o que o serviço utiliza.
        _productRepositoryMock.Setup(repo => repo.SearchAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(products);
            
        _mapperMock.Setup(mapper => mapper.Map<IEnumerable<ProductDto>>(products))
            .Returns(productDtos);

        // Act
        var result = await _productService.GetAllProductsAsync(null, null);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeEquivalentTo(productDtos);
        // Corrigido: Verifica a chamada ao método correto (SearchAsync).
        _productRepositoryMock.Verify(repo => repo.SearchAsync(null, null), Times.Once);
    }

    [Fact]
    public async Task GetProductByIdAsync_ShouldReturnProductDto_WhenProductExists()
    {
        // Arrange
        var productId = Guid.NewGuid();
        var product = new Product { Id = productId, Code = "001", Description = "Produto Teste" };
        var productDto = new ProductDto { Id = productId, Code = "001", Description = "Produto Teste" };

        _productRepositoryMock.Setup(repo => repo.GetByIdAsync(productId)).ReturnsAsync(product);
        _mapperMock.Setup(mapper => mapper.Map<ProductDto?>(product)).Returns(productDto);

        // Act
        var result = await _productService.GetProductByIdAsync(productId);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeEquivalentTo(productDto);
    }

    [Fact]
    public async Task CreateProductAsync_ShouldThrowDuplicateProductCodeException_WhenCodeExists()
    {
        // Arrange
        var createDto = new CreateProductDto { Code = "EXISTE001", Description = "Produto Duplicado" };
        var existingProduct = new Product { Id = Guid.NewGuid(), Code = createDto.Code };

        _productRepositoryMock.Setup(repo => repo.GetByCodeAsync(createDto.Code)).ReturnsAsync(existingProduct);

        // Act & Assert
        await Assert.ThrowsAsync<DuplicateProductCodeException>(() => _productService.CreateProductAsync(createDto));
        _productRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<Product>()), Times.Never);
    }

    [Fact]
    public async Task UpdateProductAsync_ShouldReturnTrue_WhenUpdateIsSuccessful()
    {
        // Arrange
        var productId = Guid.NewGuid();
        var updateDto = new UpdateProductDto { Description = "Descrição Atualizada", DepartmentCode = "010" };
        var existingProduct = new Product { Id = productId, Description = "Descrição Antiga", DepartmentCode = "020" };

        _productRepositoryMock.Setup(repo => repo.GetByIdAsync(productId)).ReturnsAsync(existingProduct);

        // Act
        var result = await _productService.UpdateProductAsync(productId, updateDto);

        // Assert
        result.Should().BeTrue();
        _productRepositoryMock.Verify(repo => repo.UpdateAsync(It.Is<Product>(p => p.Id == productId)), Times.Once);
    }
    
    [Fact]
    public async Task DeleteProductAsync_ShouldReturnTrue_WhenDeleteIsSuccessful()
    {
        // Arrange
        var productId = Guid.NewGuid();
        var existingProduct = new Product { Id = productId };

        _productRepositoryMock.Setup(repo => repo.GetByIdAsync(productId)).ReturnsAsync(existingProduct);

        // Act
        var result = await _productService.DeleteProductAsync(productId);

        // Assert
        result.Should().BeTrue();
        _productRepositoryMock.Verify(repo => repo.DeleteAsync(productId), Times.Once);
    }
}
