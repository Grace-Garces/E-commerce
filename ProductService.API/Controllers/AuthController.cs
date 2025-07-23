using Microsoft.AspNetCore.Mvc;
using ProductService.Application.DTOs;
using ProductService.Application.Interfaces;
using System.Threading.Tasks;

namespace ProductService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterUserDto registerDto)
    {
        var success = await _authService.RegisterUserAsync(registerDto);
        return success ? Ok(new { message = "Usuário registrado com sucesso!" }) : BadRequest(new { message = "Email já cadastrado." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDto loginDto)
    {
        var response = await _authService.LoginAsync(loginDto);
        return response is null ? Unauthorized(new { message = "Email ou senha inválidos." }) : Ok(response);
    }
}