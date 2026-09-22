using Backend.Infrastructure.Data.Context;
using Backend.Infrastructure.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Presentation.Controllers;

public class CreatePurchaseRequestItemDto
{
    public int? NProductId { get; set; }
    public string SSnapshotProductName { get; set; } = string.Empty;
    public string SSnapshotUnit { get; set; } = string.Empty;
    public int NQuantity { get; set; }
    public string? SRemarks { get; set; }
}

public class CreatePurchaseRequestDto
{
    public string? SRequestNo { get; set; }
    public int NDepartmentId { get; set; }
    public int NRequestedByEmployeeId { get; set; }
    public string? SStatus { get; set; }
    public string? SAdminRemarks { get; set; }
    public List<CreatePurchaseRequestItemDto> LstItems { get; set; } = new();
}

[ApiController]
[Route("api/[controller]")]
public class PurchaseRequestsController : ControllerBase
{
    private readonly PoDbContext _context;

    public PurchaseRequestsController(PoDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreatePurchaseRequest([FromBody] CreatePurchaseRequestDto dto)
    {
        // กฎความปลอดภัย: ตรวจสอบความถูกต้องของข้อมูล
        if (dto == null || dto.NRequestedByEmployeeId <= 0)
        {
            return BadRequest(new { status = "error", message = "ข้อมูลผู้ขอสั่งซื้อไม่ถูกต้อง" });
        }

        if (dto.LstItems == null || dto.LstItems.Count == 0)
        {
            return BadRequest(new { status = "error", message = "กรุณาเลือกรายการสินค้าอย่างน้อย 1 รายการ" });
        }

        var employeeExists = await _context.TmEmployees
            .AnyAsync(e => e.NEmployeeId == dto.NRequestedByEmployeeId && e.IsActive == true);
        if (!employeeExists)
        {
            return BadRequest(new { status = "error", message = "ไม่พบข้อมูลพนักงานผู้ขอสั่งซื้อในระบบ" });
        }

        var departmentExists = await _context.TmDepartments
            .AnyAsync(d => d.NDepartmentId == dto.NDepartmentId && d.IsActive == true);
        if (!departmentExists)
        {
            return BadRequest(new { status = "error", message = "ไม่พบข้อมูลแผนกที่ระบุในระบบ" });
        }

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var sDatePrefix = $"PR-{DateTime.UtcNow:yyyyMMdd}-";
            var countToday = await _context.TbPurchaseRequests
                .CountAsync(r => r.SRequestNo.StartsWith(sDatePrefix));
            var sRequestNo = $"{sDatePrefix}{(countToday + 1):D3}";

            var pr = new TbPurchaseRequest
            {
                SRequestNo = sRequestNo,
                NDepartmentId = dto.NDepartmentId,
                NRequestedByEmployeeId = dto.NRequestedByEmployeeId,
                SStatus = "PENDING_APPROVAL",
                SAdminRemarks = dto.SAdminRemarks,
                IsDeleted = false,
                DtCreatedAt = DateTime.UtcNow,
                DtUpdatedAt = DateTime.UtcNow
            };

            _context.TbPurchaseRequests.Add(pr);
            await _context.SaveChangesAsync();

            foreach (var item in dto.LstItems)
            {
                if (item.NQuantity <= 0) continue;

                var prItem = new TbPurchaseRequestItem
                {
                    NRequestId = pr.NRequestId,
                    NProductId = (item.NProductId != null && item.NProductId > 0) ? item.NProductId : null,
                    SSnapshotProductName = item.SSnapshotProductName,
                    SSnapshotUnit = item.SSnapshotUnit,
                    NQuantity = item.NQuantity,
                    SRemarks = item.SRemarks
                };
                _context.TbPurchaseRequestItems.Add(prItem);
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new
            {
                status = "success",
                message = "บันทึกคำขอสั่งซื้อ (PR) ลงฐานข้อมูลสำเร็จเรียบร้อยแล้ว",
                data = new
                {
                    nRequestId = pr.NRequestId,
                    sRequestNo = pr.SRequestNo,
                    sStatus = pr.SStatus,
                    dtCreatedAt = pr.DtCreatedAt
                }
            });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, new { status = "error", message = "เกิดข้อผิดพลาดในการบันทึกลงฐานข้อมูล: " + ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetPurchaseRequests([FromQuery] string? status)
    {
        var query = _context.TbPurchaseRequests
            .Include(r => r.NDepartment)
            .Include(r => r.NRequestedByEmployee)
            .Include(r => r.TbPurchaseRequestItems)
            .Where(r => r.IsDeleted == false)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status) && status != "ALL")
        {
            query = query.Where(r => r.SStatus == status);
        }

        var list = await query
            .OrderByDescending(r => r.DtCreatedAt)
            .Select(r => new
            {
                nRequestId = r.NRequestId,
                sRequestNo = r.SRequestNo,
                nDepartmentId = r.NDepartmentId,
                sDepartmentName = r.NDepartment.SDepartmentName,
                sDepartmentCode = r.NDepartment.SDepartmentCode,
                nRequestedByEmployeeId = r.NRequestedByEmployeeId,
                sRequestedByName = $"{r.NRequestedByEmployee.SFirstName} {r.NRequestedByEmployee.SLastName}",
                sStatus = r.SStatus,
                sAdminRemarks = r.SAdminRemarks,
                nItemCount = r.TbPurchaseRequestItems.Count,
                dtCreatedAt = r.DtCreatedAt,
                dtUpdatedAt = r.DtUpdatedAt
            })
            .ToListAsync();

        return Ok(new { status = "success", data = list });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPurchaseRequestById(int id)
    {
        var pr = await _context.TbPurchaseRequests
            .Include(r => r.NDepartment)
            .Include(r => r.NRequestedByEmployee)
            .Include(r => r.TbPurchaseRequestItems)
                .ThenInclude(i => i.NProduct)
            .Include(r => r.TbPurchaseOrders)
            .FirstOrDefaultAsync(r => r.NRequestId == id && r.IsDeleted == false);

        if (pr == null)
        {
            return NotFound(new { status = "error", message = "ไม่พบคำขอสั่งซื้อที่ระบุ" });
        }

        var po = pr.TbPurchaseOrders.OrderByDescending(p => p.DtCreatedAt).FirstOrDefault();

        var result = new
        {
            nRequestId = pr.NRequestId,
            sRequestNo = pr.SRequestNo,
            nDepartmentId = pr.NDepartmentId,
            sDepartmentName = pr.NDepartment.SDepartmentName,
            sDepartmentCode = pr.NDepartment.SDepartmentCode,
            nRequestedByEmployeeId = pr.NRequestedByEmployeeId,
            sRequestedByName = $"{pr.NRequestedByEmployee.SFirstName} {pr.NRequestedByEmployee.SLastName}",
            sStatus = pr.SStatus,
            sAdminRemarks = pr.SAdminRemarks,
            dtCreatedAt = pr.DtCreatedAt,
            dtUpdatedAt = pr.DtUpdatedAt,
            sGeneratedPoNumber = po?.SPoNumber,
            nPoId = po?.NPoId,
            lstItems = pr.TbPurchaseRequestItems.Select(i => new
            {
                nRequestItemId = i.NRequestItemId,
                nProductId = i.NProductId,
                sProductCode = i.NProduct != null ? i.NProduct.SProductCode : (i.NProductId == null || i.NProductId <= 0 ? "OFF-CATALOG" : $"CODE-{i.NProductId}"),
                sSnapshotProductName = i.SSnapshotProductName,
                sSnapshotUnit = i.SSnapshotUnit,
                nQuantity = i.NQuantity,
                sRemarks = i.SRemarks,
                isCustomItem = i.NProductId == null || i.NProductId <= 0
            }).ToList()
        };

        return Ok(new { status = "success", data = result });
    }

    public class ReviewRequestDto
    {
        public string SAction { get; set; } = string.Empty; // APPROVE, REVISION, REJECT
        public int NActionByEmployeeId { get; set; }
        public string? SRemarks { get; set; }
    }

    [HttpPost("{id}/review")]
    public async Task<IActionResult> ReviewPurchaseRequest(int id, [FromBody] ReviewRequestDto dto)
    {
        if (dto == null || string.IsNullOrWhiteSpace(dto.SAction))
        {
            return BadRequest(new { status = "error", message = "กรุณาระบุการดำเนินการ (Action)" });
        }

        var actionUpper = dto.SAction.Trim().ToUpper();
        if (actionUpper != "APPROVE" && actionUpper != "REVISION" && actionUpper != "REJECT")
        {
            return BadRequest(new { status = "error", message = "ประเภทการดำเนินการไม่ถูกต้อง (APPROVE, REVISION, REJECT)" });
        }

        var pr = await _context.TbPurchaseRequests
            .Include(r => r.TbPurchaseRequestItems)
                .ThenInclude(i => i.NProduct)
            .FirstOrDefaultAsync(r => r.NRequestId == id && r.IsDeleted == false);

        if (pr == null)
        {
            return NotFound(new { status = "error", message = "ไม่พบคำขอสั่งซื้อที่ระบุ" });
        }

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            string newStatus = actionUpper switch
            {
                "APPROVE" => "APPROVED",
                "REVISION" => "REVISION",
                "REJECT" => "REJECTED",
                _ => pr.SStatus
            };

            pr.SStatus = newStatus;
            pr.SAdminRemarks = dto.SRemarks;
            pr.DtUpdatedAt = DateTime.UtcNow;

            // บันทึก Log การอนุมัติ / การดำเนินการ
            var approvalLog = new TbApprovalLog
            {
                NRequestId = pr.NRequestId,
                NActionByEmployeeId = dto.NActionByEmployeeId > 0 ? dto.NActionByEmployeeId : pr.NRequestedByEmployeeId,
                SAction = actionUpper,
                SRemarks = dto.SRemarks,
                DtActionDate = DateTime.UtcNow
            };
            _context.TbApprovalLogs.Add(approvalLog);

            string? generatedPoNumber = null;
            int? createdPoId = null;

            // หากได้รับการอนุมัติ (APPROVE) -> สร้างใบสั่งซื้อ (PO) อัตโนมัติทันที
            if (actionUpper == "APPROVE")
            {
                var sDatePrefix = $"PO-{DateTime.UtcNow:yyyyMMdd}-";
                var countPoToday = await _context.TbPurchaseOrders
                    .CountAsync(p => p.SPoNumber.StartsWith(sDatePrefix));
                generatedPoNumber = $"{sDatePrefix}{(countPoToday + 1):D3}";

                var po = new TbPurchaseOrder
                {
                    SPoNumber = generatedPoNumber,
                    NRequestId = pr.NRequestId,
                    DtPoDate = DateTime.UtcNow.Date,
                    DtDeliveryDate = DateTime.UtcNow.Date.AddDays(7),
                    NRequestedBy = pr.NRequestedByEmployeeId,
                    NApprovedBy = dto.NActionByEmployeeId > 0 ? dto.NActionByEmployeeId : null,
                    IsApproved = true,
                    DtCreatedAt = DateTime.UtcNow
                };

                _context.TbPurchaseOrders.Add(po);
                await _context.SaveChangesAsync();

                createdPoId = po.NPoId;

                int seq = 1;
                foreach (var prItem in pr.TbPurchaseRequestItems)
                {
                    var poItem = new TbPurchaseOrderItem
                    {
                        NPoId = po.NPoId,
                        NItemSeq = seq++,
                        SProductCode = prItem.NProduct?.SProductCode ?? (prItem.NProductId == null || prItem.NProductId <= 0 ? "OFF-CATALOG" : $"CODE-{prItem.NProductId}"),
                        SProductName = prItem.SSnapshotProductName,
                        NQuantity = prItem.NQuantity,
                        SUnit = prItem.SSnapshotUnit,
                        SRemarks = prItem.SRemarks
                    };
                    _context.TbPurchaseOrderItems.Add(poItem);
                }
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            string statusMsg = actionUpper switch
            {
                "APPROVE" => $"อนุมัติคำขอสั่งซื้อสำเร็จ และสร้างใบสั่งซื้อเลขที่ {generatedPoNumber} เรียบร้อยแล้ว",
                "REVISION" => "ส่งคำขอสั่งซื้อกลับเพื่อแก้ไขเรียบร้อยแล้ว",
                "REJECT" => "ปฏิเสธคำขอสั่งซื้อเรียบร้อยแล้ว",
                _ => "ดำเนินการเรียบร้อยแล้ว"
            };

            return Ok(new
            {
                status = "success",
                message = statusMsg,
                data = new
                {
                    nRequestId = pr.NRequestId,
                    sRequestNo = pr.SRequestNo,
                    sStatus = pr.SStatus,
                    sPoNumber = generatedPoNumber,
                    nPoId = createdPoId
                }
            });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            var innerMsg = ex.InnerException != null ? " -> " + ex.InnerException.Message : "";
            Console.WriteLine($"[ReviewPurchaseRequest ERROR] {ex.Message} {innerMsg}\n{ex.StackTrace}");
            return StatusCode(500, new { status = "error", message = $"เกิดข้อผิดพลาดในการประมวลผลคำขอ: {ex.Message}{innerMsg}" });
        }
    }
}
