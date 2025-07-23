using Dapper;
using ProductService.Domain.Entities;
using ProductService.Domain.Interfaces;
using ProductService.Infrastructure.Data;
using System.Threading.Tasks;

namespace ProductService.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IDbContext _dbContext;

    public UserRepository(IDbContext dbContext)
    {
        _dbContext = dbContext;
    }

public async Task<User?> GetByEmailAsync(string email)
{
    const string sql = @"
        SELECT 
            Id, 
            Full_Name AS FullName,
            Email,
            Password_Hash AS PasswordHash,
            Status,
            Created_At AS CreatedAt
        FROM testemaxima.users
        WHERE Email = @Email;";
    using var connection = _dbContext.CreateConnection();
    return await connection.QuerySingleOrDefaultAsync<User>(sql, new { Email = email });
}

    public async Task AddAsync(User user)
    {
        const string sql = @"
            INSERT INTO testemaxima.users (Id, Full_Name, Email, Password_Hash, Status, Created_At)
            VALUES (@Id, @FullName, @Email, @PasswordHash, @Status, @CreatedAt);";
        using var connection = _dbContext.CreateConnection();
        await connection.ExecuteAsync(sql, user);
    }
}
