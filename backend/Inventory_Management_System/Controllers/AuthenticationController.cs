using Microsoft.AspNetCore.Mvc;
using Inventory_Management_System.Data;
using Microsoft.EntityFrameworkCore;
using Inventory_Management_System.Model.DTO.User;
using Inventory_Management_System.Model.Entities;
using Inventory_Management_System.Services;
using Inventory_Management_System.Data;
using Inventory_Management_System.Services;

[Route("api/[controller]")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtTokenService _jwtTokenService;

    public AuthenticationController(AppDbContext context, JwtTokenService jwtTokenService)
    {
        _context = context;
        _jwtTokenService = jwtTokenService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDTO dto)
    {
        var acc = await _context.users.FirstOrDefaultAsync(a => a.users_email == dto.Email);
        if (acc == null)
            return Unauthorized("Invalid email or password.");

        bool isValidPassword = BCrypt.Net.BCrypt.Verify(dto.Password, acc.users_password);
        if (!isValidPassword)
            return Unauthorized("Invalid email or password.");

        var token = _jwtTokenService.GenerateToken(acc.users_email);

        return Ok(new { token, message = "Login Successful!" });
    }
}
