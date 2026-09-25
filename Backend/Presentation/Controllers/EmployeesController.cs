using Backend.Infrastructure.Data.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly PoDbContext _context;

    public EmployeesController(PoDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetEmployees([FromQuery] string? search, [FromQuery] string? role, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var query = _context.TmEmployees
            .Include(e => e.NDepartment)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var sKeyword = search.Trim();
            query = query.Where(e => e.SFirstName.Contains(sKeyword) || e.SLastName.Contains(sKeyword) || e.SEmail.Contains(sKeyword));
        }

        if (!string.IsNullOrWhiteSpace(role) && role != "ALL")
        {
            query = query.Where(e => e.SRole == role);
        }

        var total = await query.CountAsync();
        var empQuery = query.OrderBy(e => e.NEmployeeId).AsQueryable();

        if (pageSize > 0)
        {
            var nPage = page < 1 ? 1 : page;
            var skip = (nPage - 1) * pageSize;
            empQuery = empQuery.Skip(skip).Take(pageSize);
        }

        var employees = await empQuery
            .Select(e => new
            {
                nEmployeeId = e.NEmployeeId,
                sFirstName = e.SFirstName,
                sLastName = e.SLastName,
                sEmail = e.SEmail,
                sRole = e.SRole,
                nDepartmentId = e.NDepartmentId,
                sDepartmentName = e.NDepartment != null ? e.NDepartment.SDepartmentName : "",
                sDepartmentCode = e.NDepartment != null ? e.NDepartment.SDepartmentCode : "",
                isActive = e.IsActive,
                dtCreatedAt = e.DtCreatedAt
            })
            .ToListAsync();

        return Ok(new { status = "success", data = employees, total = total, page = page, pageSize = pageSize });
    }

    public class UpdateEmployeeDto
    {
        public int NEmployeeId { get; set; }
        public string? SFirstName { get; set; }
        public string? SLastName { get; set; }
        public string SRole { get; set; } = "Employee";
        public int? NDepartmentId { get; set; }
        public bool IsActive { get; set; } = true;
    }

    /// <summary>
    /// อัปเดตข้อมูลผู้ใช้งาน (Role, Department, สถานะเปิด/ปิดใช้งาน)
    /// </summary>
    [HttpPost("update")]
    public async Task<IActionResult> UpdateEmployee([FromBody] UpdateEmployeeDto dto)
    {
        if (dto == null || dto.NEmployeeId <= 0)
        {
            return BadRequest(new { status = "error", message = "ข้อมูลผู้ใช้งานไม่ถูกต้อง" });
        }

        var employee = await _context.TmEmployees.FindAsync(dto.NEmployeeId);
        if (employee == null)
        {
            return NotFound(new { status = "error", message = "ไม่พบบัญชีผู้ใช้งานนี้ในระบบ" });
        }

        if (!string.IsNullOrWhiteSpace(dto.SFirstName))
        {
            employee.SFirstName = dto.SFirstName.Trim();
        }

        if (!string.IsNullOrWhiteSpace(dto.SLastName))
        {
            employee.SLastName = dto.SLastName.Trim();
        }

        if (!string.IsNullOrWhiteSpace(dto.SRole))
        {
            employee.SRole = dto.SRole.Trim();
        }

        if (dto.NDepartmentId > 0)
        {
            var deptExists = await _context.TmDepartments.AnyAsync(d => d.NDepartmentId == dto.NDepartmentId);
            if (deptExists)
            {
                employee.NDepartmentId = dto.NDepartmentId;
            }
        }

        employee.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();

        return Ok(new { status = "success", message = "อัปเดตข้อมูลผู้ใช้งานสำเร็จ", data = employee });
    }

    public class ToggleStatusDto
    {
        public int NEmployeeId { get; set; }
        public bool IsActive { get; set; }
    }

    /// <summary>
    /// สลับสถานะเปิด/ปิดการใช้งานบัญชี (Active/Inactive)
    /// </summary>
    [HttpPost("toggle-status")]
    public async Task<IActionResult> ToggleStatus([FromBody] ToggleStatusDto dto)
    {
        if (dto == null || dto.NEmployeeId <= 0)
        {
            return BadRequest(new { status = "error", message = "ข้อมูลไม่ถูกต้อง" });
        }

        var employee = await _context.TmEmployees.FindAsync(dto.NEmployeeId);
        if (employee == null)
        {
            return NotFound(new { status = "error", message = "ไม่พบบัญชีผู้ใช้งานนี้ในระบบ" });
        }

        employee.IsActive = dto.IsActive;
        await _context.SaveChangesAsync();

        var statusText = employee.IsActive ? "เปิดใช้งาน" : "ปิดการใช้งาน";
        return Ok(new { status = "success", message = $"{statusText}บัญชีเรียบร้อยแล้ว", isActive = employee.IsActive });
    }
}
