using System;
using System.Collections.Generic;

namespace Backend.Infrastructure.Data.Entities;

public partial class TmDeliveryLocation
{
    public int NLocationId { get; set; }

    public string SLocationName { get; set; } = null!;

    public bool? IsActive { get; set; }

    public DateTime DtCreatedAt { get; set; }

    public virtual ICollection<TbPurchaseOrder> TbPurchaseOrders { get; set; } = new List<TbPurchaseOrder>();
}
