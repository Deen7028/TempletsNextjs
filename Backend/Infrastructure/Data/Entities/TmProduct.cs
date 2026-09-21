using System;
using System.Collections.Generic;

namespace Backend.Infrastructure.Data.Entities;

public partial class TmProduct
{
    public int NProductId { get; set; }

    public string SProductCode { get; set; } = null!;

    public string SProductName { get; set; } = null!;


    public string SUnit { get; set; } = null!;

    public int? NDefaultSupplierId { get; set; }

    public bool? IsActive { get; set; }

    public DateTime DtCreatedAt { get; set; }

    public decimal DUnitPrice { get; set; }

    public string? SCategory { get; set; }

    public string? SImageUrl { get; set; }

    public virtual TmSupplier? NDefaultSupplier { get; set; }

    public virtual ICollection<TbPurchaseRequestItem> TbPurchaseRequestItems { get; set; } = new List<TbPurchaseRequestItem>();
}
