using System;
using System.Collections.Generic;

namespace Backend.Infrastructure.Data.Entities;

public partial class TbPurchaseRequestItem
{
    public int NRequestItemId { get; set; }

    public int NRequestId { get; set; }

    public int? NProductId { get; set; }

    public string SSnapshotProductName { get; set; } = null!;

    public string SSnapshotUnit { get; set; } = null!;

    public int NQuantity { get; set; }

    public string? SRemarks { get; set; }

    public virtual TmProduct? NProduct { get; set; }

    public virtual TbPurchaseRequest NRequest { get; set; } = null!;
}
