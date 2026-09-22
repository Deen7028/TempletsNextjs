using System;
using System.Collections.Generic;

namespace Backend.Infrastructure.Data.Entities;

public partial class TbPurchaseOrder
{
    public int NPoId { get; set; }

    public string SPoNumber { get; set; } = null!;

    public int NRequestId { get; set; }

    public DateTime DtPoDate { get; set; }

    public DateTime DtDeliveryDate { get; set; }

    public int NRequestedBy { get; set; }

    public int? NApprovedBy { get; set; }

    public bool IsApproved { get; set; }

    public DateTime DtCreatedAt { get; set; }

    public virtual TmEmployee? NApprovedByNavigation { get; set; }

    public virtual TbPurchaseRequest NRequest { get; set; } = null!;

    public virtual TmEmployee NRequestedByNavigation { get; set; } = null!;

    public virtual ICollection<TbPurchaseOrderItem> TbPurchaseOrderItems { get; set; } = new List<TbPurchaseOrderItem>();
}
