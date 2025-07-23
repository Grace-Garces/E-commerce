using ProductService.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductService.Application.Interfaces;

public interface IDepartmentService
{
    Task<IEnumerable<Department>> GetAllDepartmentsAsync();
}