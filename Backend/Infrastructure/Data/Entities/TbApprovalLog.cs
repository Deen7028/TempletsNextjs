using System;
using System.Collections.Generic;

namespace Backend.Infrastructure.Data.Entities;

public partial class TbApprovalLog
{
    public int NLogId { get; set; }

    public int NRequestId { get; set; }

    public int NActionByEmployeeId { get; set; }

    public string SAction { get; set; } = null!;

    public string? SRemarks { get; set; }

    public DateTime DtActionDate { get; set; }

    public virtual TbPurchaseRequest NRequest { get; set; } = null!;
}
