using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Application.DTOs;
using Backend.Infrastructure.Data.Context;
using Backend.Infrastructure.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Application.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<AuthResponseDto> UpdateProfileAsync(UpdateProfileDto dto);
    Task<AuthResponseDto> ChangePasswordAsync(ChangePasswordDto dto);
    Task<UserDto?> GetCurrentUserAsync(int nEmployeeId);
}


public class AuthService : IAuthService
{
    private readonly PoDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(PoDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        // 1. Data Validation
        if (string.IsNullOrWhiteSpace(dto.SFirstName) || 
            string.IsNullOrWhiteSpace(dto.SLastName) || 
            string.IsNullOrWhiteSpace(dto.SEmail) || 
            string.IsNullOrWhiteSpace(dto.SPassword))
        {
            return new AuthResponseDto { Status = "error", Message = "กรุณากรอกข้อมูลให้ครบถ้วน" };
        }

        var sNormalizedEmail = dto.SEmail.Trim().ToLower();

        // ตรวจสอบความซ้ำซ้อนของอีเมล
        var exists = await _context.TmEmployees
            .AnyAsync(e => e.SEmail == sNormalizedEmail);

        if (exists)
        {
            return new AuthResponseDto { Status = "error", Message = "อีเมลนี้มีอยู่ในระบบแล้ว" };
        }

        // จำกัด Role ให้มี Employee, Manager หรือ Admin
        var sInputRole = dto.SRole?.Trim().ToLower();
        var sRole = sInputRole switch
        {
            "admin" => "Admin",
            "manager" => "Manager",
            _ => "Employee"
        };

        // 2. Hash Password ด้วย BCrypt ตามมาตรฐาน Security
        var sPasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.SPassword);

        int? nDeptId = (dto.NDepartmentId.HasValue && dto.NDepartmentId.Value > 0) ? dto.NDepartmentId.Value : null;

        var employee = new TmEmployee
        {
            SFirstName = dto.SFirstName.Trim(),
            SLastName = dto.SLastName.Trim(),
            SEmail = sNormalizedEmail,
            SPasswordHash = sPasswordHash,
            NDepartmentId = nDeptId,
            SRole = sRole,
            IsActive = true,
            DtCreatedAt = DateTime.UtcNow
        };

        _context.TmEmployees.Add(employee);
        await _context.SaveChangesAsync();

        var department = nDeptId.HasValue ? await _context.TmDepartments.FindAsync(nDeptId.Value) : null;

        var userDto = new UserDto
        {
            NEmployeeId = employee.NEmployeeId,
            SFirstName = employee.SFirstName,
            SLastName = employee.SLastName,
            SEmail = employee.SEmail,
            SRole = employee.SRole,
            NDepartmentId = employee.NDepartmentId,
            SDepartmentName = department?.SDepartmentName
        };

        var token = GenerateJwtToken(userDto);

        return new AuthResponseDto
        {
            Status = "success",
            Message = "ลงทะเบียนพนักงานใหม่สำเร็จ",
            Token = token,
            ObjUser = userDto
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.SEmail) || string.IsNullOrWhiteSpace(dto.SPassword))
        {
            return new AuthResponseDto { Status = "error", Message = "กรุณากรอกอีเมลและรหัสผ่าน" };
        }

        var sNormalizedEmail = dto.SEmail.Trim().ToLower();

        var employee = await _context.TmEmployees
            .Include(e => e.NDepartment)
            .FirstOrDefaultAsync(e => e.SEmail == sNormalizedEmail);

        if (employee == null)
        {
            return new AuthResponseDto { Status = "error", Message = "ไม่พบบัญชีผู้ใช้งานในระบบ" };
        }

        if (employee.IsActive == false)
        {
            return new AuthResponseDto { Status = "error", Message = "บัญชีนี้ถูกปิดการใช้งาน กรุณาติดต่อผู้ดูแลระบบ" };
        }

        // ตรวจสอบรหัสผ่านด้วย BCrypt
        bool isValidPassword = false;
        if (!string.IsNullOrEmpty(employee.SPasswordHash))
        {
            try
            {
                isValidPassword = BCrypt.Net.BCrypt.Verify(dto.SPassword, employee.SPasswordHash);
            }
            catch
            {
                isValidPassword = false;
            }
        }

        if (!isValidPassword)
        {
            return new AuthResponseDto { Status = "error", Message = "รหัสผ่านไม่ถูกต้อง" };
        }

        var userDto = new UserDto
        {
            NEmployeeId = employee.NEmployeeId,
            SFirstName = employee.SFirstName ?? string.Empty,
            SLastName = employee.SLastName ?? string.Empty,
            SEmail = employee.SEmail,
            SRole = employee.SRole,
            NDepartmentId = employee.NDepartmentId,
            SDepartmentName = employee.NDepartment?.SDepartmentName
        };

        var token = GenerateJwtToken(userDto, dto.IsRememberMe ?? false);

        return new AuthResponseDto
        {
            Status = "success",
            Message = "เข้าสู่ระบบสำเร็จ",
            Token = token,
            ObjUser = userDto
        };
    }

    public async Task<AuthResponseDto> UpdateProfileAsync(UpdateProfileDto dto)
    {
        if (dto.NEmployeeId <= 0)
        {
            return new AuthResponseDto { Status = "error", Message = "รหัสพนักงานไม่ถูกต้อง" };
        }

        var employee = await _context.TmEmployees
            .Include(e => e.NDepartment)
            .FirstOrDefaultAsync(e => e.NEmployeeId == dto.NEmployeeId);

        if (employee == null)
        {
            return new AuthResponseDto { Status = "error", Message = "ไม่พบข้อมูลพนักงานในระบบ" };
        }

        employee.SFirstName = dto.SFirstName.Trim();
        employee.SLastName = dto.SLastName.Trim();
        employee.NDepartmentId = dto.NDepartmentId;

        await _context.SaveChangesAsync();

        var department = await _context.TmDepartments.FindAsync(dto.NDepartmentId);

        var userDto = new UserDto
        {
            NEmployeeId = employee.NEmployeeId,
            SFirstName = employee.SFirstName,
            SLastName = employee.SLastName,
            SEmail = employee.SEmail,
            SRole = employee.SRole,
            NDepartmentId = employee.NDepartmentId,
            SDepartmentName = department?.SDepartmentName
        };

        return new AuthResponseDto
        {
            Status = "success",
            Message = "บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว",
            ObjUser = userDto
        };
    }

    public async Task<AuthResponseDto> ChangePasswordAsync(ChangePasswordDto dto)
    {
        if (dto.NEmployeeId <= 0)
        {
            return new AuthResponseDto { Status = "error", Message = "รหัสพนักงานไม่ถูกต้อง" };
        }

        var employee = await _context.TmEmployees.FindAsync(dto.NEmployeeId);
        if (employee == null)
        {
            return new AuthResponseDto { Status = "error", Message = "ไม่พบข้อมูลพนักงานในระบบ" };
        }

        if (string.IsNullOrWhiteSpace(dto.SNewPassword) || dto.SNewPassword.Length < 6)
        {
            return new AuthResponseDto { Status = "error", Message = "รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร" };
        }

        // ตรวจสอบรหัสผ่านปัจจุบันถ้ามีตั้งค่าไว้
        if (!string.IsNullOrEmpty(employee.SPasswordHash))
        {
            bool isValidOldPassword = false;
            try
            {
                isValidOldPassword = BCrypt.Net.BCrypt.Verify(dto.SCurrentPassword, employee.SPasswordHash);
            }
            catch
            {
                isValidOldPassword = false;
            }

            if (!isValidOldPassword)
            {
                return new AuthResponseDto { Status = "error", Message = "รหัสผ่านปัจจุบันไม่ถูกต้อง" };
            }
        }

        employee.SPasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.SNewPassword);
        await _context.SaveChangesAsync();

        return new AuthResponseDto
        {
            Status = "success",
            Message = "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว"
        };
    }

    public async Task<UserDto?> GetCurrentUserAsync(int nEmployeeId)
    {
        if (nEmployeeId <= 0) return null;

        var employee = await _context.TmEmployees
            .Include(e => e.NDepartment)
            .FirstOrDefaultAsync(e => e.NEmployeeId == nEmployeeId && e.IsActive == true);

        if (employee == null) return null;

        return new UserDto
        {
            NEmployeeId = employee.NEmployeeId,
            SFirstName = employee.SFirstName ?? string.Empty,
            SLastName = employee.SLastName ?? string.Empty,
            SEmail = employee.SEmail,
            SRole = employee.SRole,
            NDepartmentId = employee.NDepartmentId,
            SDepartmentName = employee.NDepartment?.SDepartmentName
        };
    }

    private string GenerateJwtToken(UserDto user, bool isRememberMe = false)

    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var keyStr = jwtSettings["Key"] 
            ?? (_configuration.GetValue<string>("ASPNETCORE_ENVIRONMENT") == "Development" ? "YourSuperSecretStrongKeyForJwt1234567890!" : null)
            ?? throw new InvalidOperationException("JWT Key is missing from configuration.");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var durationMinutes = int.Parse(jwtSettings["DurationInMinutes"] ?? "4320");

        var sDisplayName = $"{user.SFirstName} {user.SLastName}".Trim();

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.NEmployeeId.ToString()),
            new Claim("firstName", user.SFirstName),
            new Claim("lastName", user.SLastName),
            new Claim(ClaimTypes.Name, sDisplayName),
            new Claim(ClaimTypes.Email, user.SEmail),
            new Claim(ClaimTypes.Role, user.SRole)
        };

        if (user.NDepartmentId.HasValue)
        {
            claims.Add(new Claim("departmentId", user.NDepartmentId.Value.ToString()));
        }

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(durationMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
