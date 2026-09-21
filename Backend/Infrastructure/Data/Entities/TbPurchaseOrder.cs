using System;
using System.Collections.Generic;

namespace Backend.Infrastructure.Data.Entities;

public partial class TbPurchaseOrder
{
    public int NPoId { get; set; }

    public string SPoNumber { get; set; } = null!;

    public int NRequestId { get; set; }

    public int NSupplierId { get; set; }

    public int NLocationId { get; set; }

    public DateTime DtPoDate { get; set; }

    public DateTime DtDeliveryDate { get; set; }

    public string? SRequiredTime { get; set; }

    public string? SPaymentTerm { get; set; }

    public string? SPaymentMethod { get; set; }

    public decimal DSubTotal { get; set; }

    public decimal DVatAmount { get; set; }

    public decimal DGrandTotal { get; set; }

    public int NRequestedBy { get; set; }

    public int? NCheckedBy { get; set; }

    public int? NApprovedBy { get; set; }

    public bool IsApproved { get; set; }

    public DateTime DtCreatedAt { get; set; }

    public virtual TmEmployee? NApprovedByNavigation { get; set; }

    public virtual TmEmployee? NCheckedByNavigation { get; set; }

    public virtual TmDeliveryLocation NLocation { get; set; } = null!;

    public virtual TbPurchaseRequest NRequest { get; set; } = null!;

    public virtual TmEmployee NRequestedByNavigation { get; set; } = null!;

    public virtual TmSupplier NSupplier { get; set; } = null!;

    public virtual ICollection<TbPurchaseOrderItem> TbPurchaseOrderItems { get; set; } = new List<TbPurchaseOrderItem>();
}
