using Dapper;
using ProductService.Domain.Entities;
using ProductService.Domain.Interfaces;
using ProductService.Infrastructure.Data; 
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductService.Infrastructure.Repositories;

public class DepartmentRepository : IDepartmentRepository
{
    private readonly IDbContext _dbContext;

    public DepartmentRepository(IDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Department>> GetAllAsync()
    {
        const string sql = "SELECT Code, Description FROM testemaxima.departments;";

        using (var connection = _dbContext.CreateConnection())
        {
            var departments = await connection.QueryAsync<Department>(sql);
            return departments;
        }
    }
}