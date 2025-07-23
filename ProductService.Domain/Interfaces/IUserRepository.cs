using ProductService.Domain.Entities;
using System;
using System.Threading.Tasks;

namespace ProductService.Domain.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task AddAsync(User user);
}