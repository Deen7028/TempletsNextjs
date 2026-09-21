using Backend.Infrastructure.Data.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly PoDbContext _context;

    public DepartmentsController(PoDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetDepartments()
    {
        var departments = await _context.TmDepartments
            .Where(d => d.IsActive == true)
            .OrderBy(d => d.NDepartmentId)
            .Select(d => new
            {
                nDepartmentId = d.NDepartmentId,
                sDepartmentCode = d.SDepartmentCode,
                sDepartmentName = d.SDepartmentName,
                isActive = d.IsActive
            })
            .ToListAsync();

        return Ok(new { status = "success", data = departments });
    }

    public class CreateDepartmentDto
    {
        public string SDepartmentCode { get; set; } = string.Empty;
        public string SDepartmentName { get; set; } = string.Empty;
    }

    [HttpPost]
    public async Task<IActionResult> CreateDepartment([FromBody] CreateDepartmentDto dto)
    {
        if (dto == null || string.IsNullOrWhiteSpace(dto.SDepartmentCode) || string.IsNullOrWhiteSpace(dto.SDepartmentName))
        {
            return BadRequest(new { status = "error", message = "กรุณากรอกรหัสแผนกและชื่อแผนก" });
        }

        var exists = await _context.TmDepartments.AnyAsync(d => d.SDepartmentCode == dto.SDepartmentCode.Trim());
        if (exists)
        {
            return BadRequest(new { status = "error", message = "มีรหัสแผนกนี้ในระบบแล้ว" });
        }

        var dept = new Backend.Infrastructure.Data.Entities.TmDepartment
        {
            SDepartmentCode = dto.SDepartmentCode.Trim(),
            SDepartmentName = dto.SDepartmentName.Trim(),
            IsActive = true,
            DtCreatedAt = DateTime.UtcNow
        };

        _context.TmDepartments.Add(dept);
        await _context.SaveChangesAsync();

        return Ok(new { status = "success", message = "เพิ่มแผนกใหม่สำเร็จ", data = dept });
    }

    public class UpdateDepartmentDto
    {
        public int NDepartmentId { get; set; }
        public string SDepartmentName { get; set; } = string.Empty;
    }

    [HttpPost("update")]
    public async Task<IActionResult> UpdateDepartment([FromBody] UpdateDepartmentDto dto)
    {
        if (dto == null || dto.NDepartmentId <= 0 || string.IsNullOrWhiteSpace(dto.SDepartmentName))
        {
            return BadRequest(new { status = "error", message = "กรุณาระบุชื่อแผนกที่ต้องการแก้ไข" });
        }

        var dept = await _context.TmDepartments.FindAsync(dto.NDepartmentId);
        if (dept == null)
        {
            return NotFound(new { status = "error", message = "ไม่พบแผนกนี้ในระบบ" });
        }

        dept.SDepartmentName = dto.SDepartmentName.Trim();
        await _context.SaveChangesAsync();

        return Ok(new { status = "success", message = "อัปเดตข้อมูลแผนกสำเร็จ", data = dept });
    }

    public class DeleteDepartmentDto
    {
        public int NDepartmentId { get; set; }
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteDepartment([FromBody] DeleteDepartmentDto dto)
    {
        if (dto == null || dto.NDepartmentId <= 0)
        {
            return BadRequest(new { status = "error", message = "รหัสแผนกไม่ถูกต้อง" });
        }

        var dept = await _context.TmDepartments.FindAsync(dto.NDepartmentId);
        if (dept == null)
        {
            return NotFound(new { status = "error", message = "ไม่พบแผนกนี้ในระบบ" });
        }

        // ตรวจสอบว่ามีพนักงานสังกัดแผนกนี้อยู่หรือไม่
        var hasEmployees = await _context.TmEmployees.AnyAsync(e => e.NDepartmentId == dto.NDepartmentId);
        if (hasEmployees)
        {
            dept.IsActive = false;
            await _context.SaveChangesAsync();
            return Ok(new { status = "success", message = "ปิดการใช้งานแผนกเรียบร้อยแล้ว (เนื่องจากมีพนักงานสังกัดอยู่)" });
        }

        _context.TmDepartments.Remove(dept);
        await _context.SaveChangesAsync();

        return Ok(new { status = "success", message = "ลบข้อมูลแผนกเรียบร้อยแล้ว" });
    }
}
