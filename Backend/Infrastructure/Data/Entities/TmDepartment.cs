using System;
using System.Collections.Generic;

namespace Backend.Infrastructure.Data.Entities;

public partial class TmDepartment
{
    public int NDepartmentId { get; set; }

    public string SDepartmentCode { get; set; } = null!;

    public string SDepartmentName { get; set; } = null!;

    public bool? IsActive { get; set; }

    public DateTime DtCreatedAt { get; set; }

    public virtual ICollection<TbPurchaseRequest> TbPurchaseRequests { get; set; } = new List<TbPurchaseRequest>();

    public virtual ICollection<TmEmployee> TmEmployees { get; set; } = new List<TmEmployee>();
}
