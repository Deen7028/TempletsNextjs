using System;
using System.Collections.Generic;

namespace Backend.Infrastructure.Data.Entities;

public partial class TmEmployee
{
    public int NEmployeeId { get; set; }

    public string? SFirstName { get; set; }

    public string? SLastName { get; set; }

    public string SEmail { get; set; } = null!;

    public string? SPasswordHash { get; set; }

    public string SRole { get; set; } = "Employee";

    public int? NDepartmentId { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime DtCreatedAt { get; set; }

    public virtual TmDepartment? NDepartment { get; set; }

    public virtual ICollection<TbPurchaseOrder> TbPurchaseOrderNApprovedByNavigations { get; set; } = new List<TbPurchaseOrder>();

    public virtual ICollection<TbPurchaseOrder> TbPurchaseOrderNCheckedByNavigations { get; set; } = new List<TbPurchaseOrder>();

    public virtual ICollection<TbPurchaseOrder> TbPurchaseOrderNRequestedByNavigations { get; set; } = new List<TbPurchaseOrder>();

    public virtual ICollection<TbPurchaseRequest> TbPurchaseRequests { get; set; } = new List<TbPurchaseRequest>();
}
