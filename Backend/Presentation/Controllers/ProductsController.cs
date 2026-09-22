using Backend.Infrastructure.Data.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly PoDbContext _context;

    public ProductsController(PoDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] string? search)
    {
        var query = _context.TmProducts
            .Where(p => p.IsActive == true);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var sKeyword = search.Trim();
            query = query.Where(p => p.SProductName.Contains(sKeyword) || p.SProductCode.Contains(sKeyword));
        }

        var products = await query
            .OrderBy(p => p.NProductId)
            .Select(p => new
            {
                nProductId = p.NProductId,
                sProductCode = p.SProductCode,
                sProductName = p.SProductName,
                sUnit = p.SUnit,
                sCategory = p.SCategory,
                isActive = p.IsActive
            })
            .ToListAsync();

        return Ok(new { status = "success", data = products });
    }

    public class CreateProductDto
    {
        public string SProductCode { get; set; } = string.Empty;
        public string SProductName { get; set; } = string.Empty;
        public string SUnit { get; set; } = string.Empty;
        public string? SCategory { get; set; }
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
    {
        if (dto == null || string.IsNullOrWhiteSpace(dto.SProductCode) || string.IsNullOrWhiteSpace(dto.SProductName))
        {
            return BadRequest(new { status = "error", message = "กรุณากรอกรหัสสินค้าและชื่อสินค้า" });
        }

        var exists = await _context.TmProducts.AnyAsync(p => p.SProductCode == dto.SProductCode.Trim());
        if (exists)
        {
            return BadRequest(new { status = "error", message = "มีรหัสสินค้านี้ในระบบแล้ว" });
        }

        var product = new Backend.Infrastructure.Data.Entities.TmProduct
        {
            SProductCode = dto.SProductCode.Trim(),
            SProductName = dto.SProductName.Trim(),
            SUnit = dto.SUnit.Trim(),
            SCategory = dto.SCategory?.Trim(),
            IsActive = true,
            DtCreatedAt = DateTime.UtcNow
        };

        _context.TmProducts.Add(product);
        await _context.SaveChangesAsync();

        return Ok(new { status = "success", message = "เพิ่มสินค้าใหม่สำเร็จ", data = product });
    }

    public class UpdateProductDto
    {
        public int NProductId { get; set; }
        public string SProductName { get; set; } = string.Empty;
        public string SUnit { get; set; } = string.Empty;
        public string? SCategory { get; set; }
    }

    [HttpPost("update")]
    public async Task<IActionResult> UpdateProduct([FromBody] UpdateProductDto dto)
    {
        if (dto == null || dto.NProductId <= 0 || string.IsNullOrWhiteSpace(dto.SProductName) || string.IsNullOrWhiteSpace(dto.SUnit))
        {
            return BadRequest(new { status = "error", message = "กรุณากรอกข้อมูลสินค้าให้ถูกต้องและครบถ้วน" });
        }

        var product = await _context.TmProducts.FindAsync(dto.NProductId);
        if (product == null)
        {
            return NotFound(new { status = "error", message = "ไม่พบรายการสินค้านี้ในระบบ" });
        }

        product.SProductName = dto.SProductName.Trim();
        product.SUnit = dto.SUnit.Trim();
        product.SCategory = dto.SCategory?.Trim();

        await _context.SaveChangesAsync();

        return Ok(new { status = "success", message = "อัปเดตข้อมูลสินค้าสำเร็จ", data = product });
    }

    public class DeleteProductDto
    {
        public int NProductId { get; set; }
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteProduct([FromBody] DeleteProductDto dto)
    {
        if (dto == null || dto.NProductId <= 0)
        {
            return BadRequest(new { status = "error", message = "รหัสสินค้าไม่ถูกต้อง" });
        }

        var product = await _context.TmProducts.FindAsync(dto.NProductId);
        if (product == null)
        {
            return NotFound(new { status = "error", message = "ไม่พบรายการสินค้านี้ในระบบ" });
        }

        // ตรวจสอบว่าสินค้าถูกใช้ในคำขอสั่งซื้อ (PR Items) หรือไม่
        var isUsedInPR = await _context.TbPurchaseRequestItems.AnyAsync(pri => pri.NProductId == dto.NProductId);
        if (isUsedInPR)
        {
            // หากมีการอ้างอิงอยู่แล้ว ให้ soft delete (ปิดการใช้งาน)
            product.IsActive = false;
            await _context.SaveChangesAsync();
            return Ok(new { status = "success", message = "ปิดการใช้งานสินค้าสำเร็จ (เนื่องจากมีประวัติในระบบจัดซื้อแล้ว)" });
        }

        _context.TmProducts.Remove(product);
        await _context.SaveChangesAsync();

        return Ok(new { status = "success", message = "ลบข้อมูลสินค้าเรียบร้อยแล้ว" });
    }
}
