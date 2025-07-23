using System;

namespace ProductService.Domain.Entities;

public class Product
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string DepartmentCode { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public bool Status { get; set; } 
    public int Estado_prod { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string DepartmentDescription { get; set; } = string.Empty; 
}