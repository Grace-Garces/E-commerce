using ProductService.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductService.Domain.Interfaces;

public interface IDepartmentRepository
{
    Task<IEnumerable<Department>> GetAllAsync();
}