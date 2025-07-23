using System;

namespace ProductService.Application.DTOs;

public class ProductDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string DepartmentCode { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public bool Status { get; set; } // Propriedade reintroduzida
    public int Estado_prod { get; set; }
    public string DepartmentDescription { get; set; } = string.Empty;
}

public class CreateProductDto
{
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string DepartmentCode { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public bool Status { get; set; } = true; // Propriedade reintroduzida
    public int Estado_prod { get; set; } = 2;
}

public class UpdateProductDto
{
    public string Description { get; set; } = string.Empty;
    public string DepartmentCode { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public bool Status { get; set; } // Propriedade reintroduzida
    public int Estado_prod { get; set; }
}