using System;
using System.Collections.Generic;

namespace Backend.Infrastructure.Data.Entities;

public partial class TmSupplier
{
    public int NSupplierId { get; set; }

    public string SSupplierCode { get; set; } = null!;

    public string SSupplierName { get; set; } = null!;

    public string? SBranch { get; set; }

    public string? SAddress { get; set; }

    public string? SContactName { get; set; }

    public string? STelFax { get; set; }

    public string? SPaymentTerm { get; set; }

    public string? SPaymentMethod { get; set; }

    public bool? IsActive { get; set; }

    public DateTime DtCreatedAt { get; set; }

    public virtual ICollection<TbPurchaseOrder> TbPurchaseOrders { get; set; } = new List<TbPurchaseOrder>();

    public virtual ICollection<TmProduct> TmProducts { get; set; } = new List<TmProduct>();
}
