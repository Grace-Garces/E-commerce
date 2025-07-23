using Dapper;
using ProductService.Domain.Entities;
using ProductService.Domain.Interfaces;
using ProductService.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ProductService.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly IDbContext _dbContext;

    public ProductRepository(IDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Product>> SearchAsync(string? searchTerm, string? departmentCode)
    {
        var sqlBuilder = new StringBuilder(@"
            SELECT 
                p.Id, p.Code, p.Description, p.department_code AS DepartmentCode, 
                p.Price, p.Status, p.Estado_prod, p.created_at AS CreatedAt, p.updated_at AS UpdatedAt,
                d.description AS DepartmentDescription 
            FROM testemaxima.products p
            LEFT JOIN testemaxima.departments d ON p.department_code = d.code
            WHERE p.Estado_prod != 4"); // Filtra para NÃO mostrar produtos deletados logicamente

        var parameters = new DynamicParameters();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            sqlBuilder.Append(" AND (p.Description LIKE @SearchTerm OR p.Code LIKE @SearchTerm)");
            parameters.Add("SearchTerm", $"%{searchTerm}%");
        }

        if (!string.IsNullOrWhiteSpace(departmentCode))
        {
            sqlBuilder.Append(" AND p.department_code = @DepartmentCode");
            parameters.Add("DepartmentCode", departmentCode);
        }

        sqlBuilder.Append(" ORDER BY p.Description;");

        using var connection = _dbContext.CreateConnection();
        return await connection.QueryAsync<Product>(sqlBuilder.ToString(), parameters);
    }

    public async Task AddAsync(Product product)
    {
        const string sql = @"
            INSERT INTO testemaxima.products (Id, Code, Description, department_code, Price, Status, Estado_prod, created_at)
            VALUES (@Id, @Code, @Description, @DepartmentCode, @Price, @Status, @Estado_prod, @CreatedAt);";

        using var connection = _dbContext.CreateConnection();
        await connection.ExecuteAsync(sql, product);
    }

    public async Task UpdateAsync(Product product)
    {
        const string sql = @"
            UPDATE testemaxima.products
            SET Description = @Description,
                department_code = @DepartmentCode,
                Price = @Price,
                Status = @Status,
                Estado_prod = @Estado_prod,
                updated_at = @UpdatedAt
            WHERE Id = @Id;";

        using var connection = _dbContext.CreateConnection();
        await connection.ExecuteAsync(sql, product);
    }

    public async Task DeleteAsync(Guid id)
    {
        const string sql = @"
            UPDATE testemaxima.products
            SET Estado_prod = 4,
                updated_at = @Now
            WHERE Id = @Id;";

        using var connection = _dbContext.CreateConnection();
        await connection.ExecuteAsync(sql, new { Id = id, Now = DateTime.UtcNow });
    }
    
    public async Task<Product?> GetByIdAsync(Guid id)
    {
        const string sql = @"
            SELECT 
                p.*, d.description as DepartmentDescription 
            FROM testemaxima.products p
            LEFT JOIN testemaxima.departments d ON p.department_code = d.code
            WHERE p.Id = @Id;";
        using var connection = _dbContext.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Product>(sql, new { Id = id });
    }

    public async Task<Product?> GetByCodeAsync(string code)
    {
        const string sql = "SELECT * FROM testemaxima.products WHERE Code = @Code;";
        using var connection = _dbContext.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Product>(sql, new { Code = code });
    }
}
