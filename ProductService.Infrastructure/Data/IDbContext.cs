using System.Data;

namespace ProductService.Infrastructure.Data;

public interface IDbContext
{
    IDbConnection CreateConnection();
}
