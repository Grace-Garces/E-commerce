using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Data;

namespace ProductService.Infrastructure.Data;

public class MySqlDbContext : IDbContext
{
    private readonly IConfiguration _configuration;
    private readonly string _connectionString;

    public MySqlDbContext(IConfiguration configuration)
    {
        _configuration = configuration;
        _connectionString = _configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("A string de conexão 'DefaultConnection' não foi encontrada ou está vazia no appsettings.json.");
    }

    public IDbConnection CreateConnection()
        => new MySqlConnection(_connectionString);
}