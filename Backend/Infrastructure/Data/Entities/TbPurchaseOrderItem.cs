using System;
using System.Collections.Generic;

namespace Backend.Infrastructure.Data.Entities;

public partial class TbPurchaseOrderItem
{
    public int NPoItemId { get; set; }

    public int NPoId { get; set; }

    public int NItemSeq { get; set; }

    public string SProductCode { get; set; } = null!;

    public string SProductName { get; set; } = null!;

    public int NQuantity { get; set; }

    public string SUnit { get; set; } = null!;

    public string? SRemarks { get; set; }

    public virtual TbPurchaseOrder NPo { get; set; } = null!;
}
