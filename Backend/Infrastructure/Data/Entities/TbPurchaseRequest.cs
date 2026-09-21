using System;
using System.Collections.Generic;

namespace Backend.Infrastructure.Data.Entities;

public partial class TbPurchaseRequest
{
    public int NRequestId { get; set; }

    public string SRequestNo { get; set; } = null!;

    public int NDepartmentId { get; set; }

    public int NRequestedByEmployeeId { get; set; }

    public string SStatus { get; set; } = null!;

    public string? SAdminRemarks { get; set; }

    public bool IsDeleted { get; set; }

    public DateTime DtCreatedAt { get; set; }

    public DateTime DtUpdatedAt { get; set; }

    public virtual TmDepartment NDepartment { get; set; } = null!;

    public virtual TmEmployee NRequestedByEmployee { get; set; } = null!;

    public virtual ICollection<TbApprovalLog> TbApprovalLogs { get; set; } = new List<TbApprovalLog>();

    public virtual ICollection<TbPurchaseOrder> TbPurchaseOrders { get; set; } = new List<TbPurchaseOrder>();

    public virtual ICollection<TbPurchaseRequestItem> TbPurchaseRequestItems { get; set; } = new List<TbPurchaseRequestItem>();
}
