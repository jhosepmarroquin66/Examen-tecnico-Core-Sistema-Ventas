using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SistemaVentas.Core.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SistemaVentas.Controllers;
//[Authorize] // <--- Esto obliga a enviar el Token JWT
[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;

    public AuthController(IConfiguration config)
    {
        _config = config;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] UsuarioLogin usuario)
    {
        // Validación de ejemplo (En producción usarías BD)
        if (usuario.Username == "admin" && usuario.Password == "123456")
        {
            var token = GenerarToken();
            return Ok(new { token = token });
        }

        return Unauthorized("Usuario o contraseña incorrectos");
    }

    private string GenerarToken()
    {
        var jwtSettings = _config.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, "Administrador"),
            new Claim(ClaimTypes.Role, "Admin"),
            new Claim("CustomClaim", "Examen2025")
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(30), // REQUERIMIENTO: 30 MINUTOS
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
//{
//  "username": "admin",
//  "password": "123456"
//}
//Bearer 