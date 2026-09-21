using Backend.Application.DTOs;
using Backend.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Presentation.Controllers;

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
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var response = await _authService.RegisterAsync(dto);
        if (response.Status == "error")
        {
            return BadRequest(response);
        }

        // Set HttpOnly cookie for token (Security best practice)
        if (!string.IsNullOrEmpty(response.Token))
        {
            Response.Cookies.Append("token", response.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });
        }

        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var response = await _authService.LoginAsync(dto);
        if (response.Status == "error")
        {
            return BadRequest(response);
        }

        if (!string.IsNullOrEmpty(response.Token))
        {
            var expiryDays = dto.IsRememberMe == true ? 30 : 7;
            Response.Cookies.Append("token", response.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddDays(expiryDays)
            });
        }

        return Ok(response);
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("token");
        return Ok(new { status = "success", message = "ออกจากระบบเรียบร้อยแล้ว" });
    }

    [HttpPost("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        // 1. อ่าน token จาก HttpOnly Cookie หรือ Authorization header
        var token = Request.Cookies["token"];
        if (string.IsNullOrEmpty(token))
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            if (authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                token = authHeader.Substring("Bearer ".Length).Trim();
            }
        }

        if (string.IsNullOrEmpty(token))
        {
            return Unauthorized(new { status = "error", message = "ไม่พบ Token การเข้าสู่ระบบ" });
        }

        try
        {
            var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            var subClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub || c.Type == "sub" || c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
            if (subClaim == null || !int.TryParse(subClaim.Value, out int nEmployeeId))
            {
                return Unauthorized(new { status = "error", message = "Token ไม่ถูกต้องหรือข้อมูลผู้ใช้ไม่สมบูรณ์" });
            }

            var user = await _authService.GetCurrentUserAsync(nEmployeeId);
            if (user == null)
            {
                return Unauthorized(new { status = "error", message = "ไม่พบบัญชีผู้ใช้งานในระบบ" });
            }

            return Ok(new { status = "success", data = user });
        }
        catch
        {
            return Unauthorized(new { status = "error", message = "Token หมดอายุหรือไม่ถูกต้อง" });
        }
    }

    [HttpPost("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)

    {
        if (dto == null || dto.NEmployeeId <= 0)
        {
            return BadRequest(new { status = "error", message = "รหัสพนักงานไม่ถูกต้องหรือไม่มีการส่งข้อมูล" });
        }

        var response = await _authService.UpdateProfileAsync(dto);
        if (response.Status == "error")
        {
            return BadRequest(response);
        }
        return Ok(response);
    }

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        if (dto == null || dto.NEmployeeId <= 0)
        {
            return BadRequest(new { status = "error", message = "รหัสพนักงานไม่ถูกต้องหรือไม่มีการส่งข้อมูล" });
        }

        var response = await _authService.ChangePasswordAsync(dto);
        if (response.Status == "error")
        {
            return BadRequest(response);
        }
        return Ok(response);
    }
}
