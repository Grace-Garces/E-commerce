using Microsoft.AspNetCore.Mvc;
using ProductService.Application.DTOs;
using ProductService.Application.Interfaces;
using System;
using System.Threading.Tasks;
using ProductService.Application.Exceptions;

namespace ProductService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? searchTerm, [FromQuery] string? departmentCode)
    {
        var products = await _productService.GetAllProductsAsync(searchTerm, departmentCode);
        return Ok(products);
    }

    // ... (outros métodos permanecem os mesmos)
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var product = await _productService.GetProductByIdAsync(id);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProductDto createDto)
    {
        try
        {
            var newProduct = await _productService.CreateProductAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = newProduct.Id }, newProduct);
        }
        catch (DuplicateProductCodeException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateProductDto updateDto)
    {
        var success = await _productService.UpdateProductAsync(id, updateDto);
        return success ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _productService.DeleteProductAsync(id);
        return success ? NoContent() : NotFound();
    }
}