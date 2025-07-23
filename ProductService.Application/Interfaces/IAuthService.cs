using ProductService.Application.DTOs;
using System.Threading.Tasks;

namespace ProductService.Application.Interfaces;

public interface IAuthService
{
    Task<bool> RegisterUserAsync(RegisterUserDto registerDto);
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto loginDto);
}