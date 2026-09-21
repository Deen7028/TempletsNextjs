using System;
using System.Collections.Generic;
using Backend.Infrastructure.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Data.Context;

public partial class PoDbContext : DbContext
{
    public PoDbContext()
    {
    }

    public PoDbContext(DbContextOptions<PoDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<TbApprovalLog> TbApprovalLogs { get; set; }

    public virtual DbSet<TbPurchaseOrder> TbPurchaseOrders { get; set; }

    public virtual DbSet<TbPurchaseOrderItem> TbPurchaseOrderItems { get; set; }

    public virtual DbSet<TbPurchaseRequest> TbPurchaseRequests { get; set; }

    public virtual DbSet<TbPurchaseRequestItem> TbPurchaseRequestItems { get; set; }

    public virtual DbSet<TmDeliveryLocation> TmDeliveryLocations { get; set; }

    public virtual DbSet<TmDepartment> TmDepartments { get; set; }

    public virtual DbSet<TmEmployee> TmEmployees { get; set; }

    public virtual DbSet<TmProduct> TmProducts { get; set; }

    public virtual DbSet<TmSupplier> TmSuppliers { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TbApprovalLog>(entity =>
        {
            entity.ToTable("tbApprovalLogs");
            entity.HasKey(e => e.NLogId);

            entity.HasIndex(e => e.NRequestId, "FK_Logs_PR");

            entity.Property(e => e.NLogId).HasColumnName("nLogId");
            entity.Property(e => e.DtActionDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("dtActionDate");
            entity.Property(e => e.NActionByEmployeeId).HasColumnName("nActionByEmployeeId");
            entity.Property(e => e.NRequestId).HasColumnName("nRequestId");
            entity.Property(e => e.SAction)
                .HasMaxLength(50)
                .HasColumnName("sAction");
            entity.Property(e => e.SRemarks)
                .HasColumnType("text")
                .HasColumnName("sRemarks");

            entity.HasOne(d => d.NRequest).WithMany(p => p.TbApprovalLogs)
                .HasForeignKey(d => d.NRequestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Logs_PR");
        });

        modelBuilder.Entity<TbPurchaseOrder>(entity =>
        {
            entity.ToTable("tbPurchaseOrders");
            entity.HasKey(e => e.NPoId);

            entity.HasIndex(e => e.NApprovedBy, "FK_PO_ApprovedBy");

            entity.HasIndex(e => e.NCheckedBy, "FK_PO_CheckedBy");

            entity.HasIndex(e => e.NLocationId, "FK_PO_Location");

            entity.HasIndex(e => e.NRequestId, "FK_PO_Request");

            entity.HasIndex(e => e.NRequestedBy, "FK_PO_RequestedBy");

            entity.HasIndex(e => e.NSupplierId, "FK_PO_Supplier");

            entity.HasIndex(e => e.SPoNumber, "IX_PO_PoNumber");

            entity.HasIndex(e => e.SPoNumber, "sPoNumber").IsUnique();

            entity.Property(e => e.NPoId).HasColumnName("nPoId");
            entity.Property(e => e.DtCreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("dtCreatedAt");
            entity.Property(e => e.DtDeliveryDate)
                .HasColumnType("date")
                .HasColumnName("dtDeliveryDate");
            entity.Property(e => e.DtPoDate)
                .HasColumnType("date")
                .HasColumnName("dtPoDate");
            entity.Property(e => e.IsApproved).HasColumnName("isApproved");
            entity.Property(e => e.NApprovedBy).HasColumnName("nApprovedBy");
            entity.Property(e => e.NCheckedBy).HasColumnName("nCheckedBy");
            entity.Property(e => e.NLocationId).HasColumnName("nLocationId");
            entity.Property(e => e.NRequestId).HasColumnName("nRequestId");
            entity.Property(e => e.NRequestedBy).HasColumnName("nRequestedBy");
            entity.Property(e => e.NSupplierId).HasColumnName("nSupplierId");
            entity.Property(e => e.SPaymentMethod)
                .HasMaxLength(50)
                .HasColumnName("sPaymentMethod");
            entity.Property(e => e.DSubTotal)
                .HasPrecision(12, 2)
                .HasColumnName("dSubTotal");
            entity.Property(e => e.DVatAmount)
                .HasPrecision(12, 2)
                .HasColumnName("dVatAmount");
            entity.Property(e => e.DGrandTotal)
                .HasPrecision(12, 2)
                .HasColumnName("dGrandTotal");
            entity.Property(e => e.SPaymentTerm)
                .HasMaxLength(50)
                .HasColumnName("sPaymentTerm");
            entity.Property(e => e.SPoNumber)
                .HasMaxLength(50)
                .HasColumnName("sPoNumber");
            entity.Property(e => e.SRequiredTime)
                .HasMaxLength(50)
                .HasColumnName("sRequiredTime");

            entity.HasOne(d => d.NApprovedByNavigation).WithMany(p => p.TbPurchaseOrderNApprovedByNavigations)
                .HasForeignKey(d => d.NApprovedBy)
                .HasConstraintName("FK_PO_ApprovedBy");

            entity.HasOne(d => d.NCheckedByNavigation).WithMany(p => p.TbPurchaseOrderNCheckedByNavigations)
                .HasForeignKey(d => d.NCheckedBy)
                .HasConstraintName("FK_PO_CheckedBy");

            entity.HasOne(d => d.NLocation).WithMany(p => p.TbPurchaseOrders)
                .HasForeignKey(d => d.NLocationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PO_Location");

            entity.HasOne(d => d.NRequest).WithMany(p => p.TbPurchaseOrders)
                .HasForeignKey(d => d.NRequestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PO_Request");

            entity.HasOne(d => d.NRequestedByNavigation).WithMany(p => p.TbPurchaseOrderNRequestedByNavigations)
                .HasForeignKey(d => d.NRequestedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PO_RequestedBy");

            entity.HasOne(d => d.NSupplier).WithMany(p => p.TbPurchaseOrders)
                .HasForeignKey(d => d.NSupplierId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PO_Supplier");
        });

        modelBuilder.Entity<TbPurchaseOrderItem>(entity =>
        {
            entity.ToTable("tbPurchaseOrderItems");
            entity.HasKey(e => e.NPoItemId);

            entity.HasIndex(e => e.NPoId, "FK_POItems_PO");

            entity.Property(e => e.NPoItemId).HasColumnName("nPoItemId");
            entity.Property(e => e.NItemSeq).HasColumnName("nItemSeq");
            entity.Property(e => e.NPoId).HasColumnName("nPoId");
            entity.Property(e => e.NQuantity).HasColumnName("nQuantity");
            entity.Property(e => e.SProductCode)
                .HasMaxLength(50)
                .HasColumnName("sProductCode");
            entity.Property(e => e.SProductName)
                .HasMaxLength(255)
                .HasColumnName("sProductName");
            entity.Property(e => e.SRemarks)
                .HasMaxLength(255)
                .HasColumnName("sRemarks");
            entity.Property(e => e.SUnit)
                .HasMaxLength(50)
                .HasColumnName("sUnit");
            entity.Property(e => e.DUnitPrice)
                .HasPrecision(12, 2)
                .HasColumnName("dUnitPrice");
            entity.Property(e => e.DLineTotal)
                .HasPrecision(12, 2)
                .HasColumnName("dLineTotal");

            entity.HasOne(d => d.NPo).WithMany(p => p.TbPurchaseOrderItems)
                .HasForeignKey(d => d.NPoId)
                .HasConstraintName("FK_POItems_PO");
        });

        modelBuilder.Entity<TbPurchaseRequest>(entity =>
        {
            entity.ToTable("tbPurchaseRequests");
            entity.HasKey(e => e.NRequestId);

            entity.HasIndex(e => e.NDepartmentId, "FK_PR_Department");

            entity.HasIndex(e => e.NRequestedByEmployeeId, "FK_PR_Employee");

            entity.HasIndex(e => e.DtCreatedAt, "IX_PR_CreatedAt");

            entity.HasIndex(e => e.SStatus, "IX_PR_Status");

            entity.HasIndex(e => e.SRequestNo, "sRequestNo").IsUnique();

            entity.Property(e => e.NRequestId).HasColumnName("nRequestId");
            entity.Property(e => e.DtCreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("dtCreatedAt");
            entity.Property(e => e.DtUpdatedAt)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("dtUpdatedAt");
            entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");
            entity.Property(e => e.NDepartmentId).HasColumnName("nDepartmentId");
            entity.Property(e => e.NRequestedByEmployeeId).HasColumnName("nRequestedByEmployeeId");
            entity.Property(e => e.SAdminRemarks)
                .HasColumnType("text")
                .HasColumnName("sAdminRemarks");
            entity.Property(e => e.SRequestNo)
                .HasMaxLength(50)
                .HasColumnName("sRequestNo");
            entity.Property(e => e.SStatus)
                .HasMaxLength(30)
                .HasDefaultValueSql("'PENDING_APPROVAL'")
                .HasColumnName("sStatus");

            entity.HasOne(d => d.NDepartment).WithMany(p => p.TbPurchaseRequests)
                .HasForeignKey(d => d.NDepartmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PR_Department");

            entity.HasOne(d => d.NRequestedByEmployee).WithMany(p => p.TbPurchaseRequests)
                .HasForeignKey(d => d.NRequestedByEmployeeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PR_Employee");
        });

        modelBuilder.Entity<TbPurchaseRequestItem>(entity =>
        {
            entity.ToTable("tbPurchaseRequestItems");
            entity.HasKey(e => e.NRequestItemId);

            entity.HasIndex(e => e.NProductId, "FK_PRItems_Product");

            entity.HasIndex(e => e.NRequestId, "FK_PRItems_Request");

            entity.Property(e => e.NRequestItemId).HasColumnName("nRequestItemId");
            entity.Property(e => e.NProductId).HasColumnName("nProductId");
            entity.Property(e => e.NQuantity).HasColumnName("nQuantity");
            entity.Property(e => e.NRequestId).HasColumnName("nRequestId");
            entity.Property(e => e.SRemarks)
                .HasMaxLength(255)
                .HasColumnName("sRemarks");
            entity.Property(e => e.SSnapshotProductName)
                .HasMaxLength(255)
                .HasColumnName("sSnapshotProductName");
            entity.Property(e => e.SSnapshotUnit)
                .HasMaxLength(50)
                .HasColumnName("sSnapshotUnit");
            entity.Property(e => e.DUnitPrice)
                .HasPrecision(12, 2)
                .HasColumnName("dUnitPrice");
            entity.Property(e => e.DLineTotal)
                .HasPrecision(12, 2)
                .HasColumnName("dLineTotal");

            entity.HasOne(d => d.NProduct).WithMany(p => p.TbPurchaseRequestItems)
                .HasForeignKey(d => d.NProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PRItems_Product");

            entity.HasOne(d => d.NRequest).WithMany(p => p.TbPurchaseRequestItems)
                .HasForeignKey(d => d.NRequestId)
                .HasConstraintName("FK_PRItems_Request");
        });

        modelBuilder.Entity<TmDeliveryLocation>(entity =>
        {
            entity.ToTable("tmDeliveryLocations");
            entity.HasKey(e => e.NLocationId);

            entity.Property(e => e.NLocationId).HasColumnName("nLocationId");
            entity.Property(e => e.DtCreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("dtCreatedAt");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValue(true)
                .HasColumnName("isActive");
            entity.Property(e => e.SLocationName)
                .HasMaxLength(255)
                .HasColumnName("sLocationName");
        });

        modelBuilder.Entity<TmDepartment>(entity =>
        {
            entity.ToTable("tmDepartments");
            entity.HasKey(e => e.NDepartmentId);

            entity.HasIndex(e => e.SDepartmentCode, "sDepartmentCode").IsUnique();

            entity.Property(e => e.NDepartmentId).HasColumnName("nDepartmentId");
            entity.Property(e => e.DtCreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("dtCreatedAt");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValue(true)
                .HasColumnName("isActive");
            entity.Property(e => e.SDepartmentCode)
                .HasMaxLength(50)
                .HasColumnName("sDepartmentCode");
            entity.Property(e => e.SDepartmentName)
                .HasMaxLength(150)
                .HasColumnName("sDepartmentName");
        });

        modelBuilder.Entity<TmEmployee>(entity =>
        {
            entity.ToTable("tmEmployees");
            entity.HasKey(e => e.NEmployeeId);

            entity.HasIndex(e => e.NDepartmentId, "FK_Employees_Department");

            entity.Property(e => e.NEmployeeId).HasColumnName("nEmployeeId");
            entity.Property(e => e.DtCreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("dtCreatedAt");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValue(true)
                .HasColumnName("isActive");
            entity.Property(e => e.NDepartmentId).HasColumnName("nDepartmentId");
            entity.Property(e => e.SFirstName)
                .HasMaxLength(100)
                .HasColumnName("sFirstName");
            entity.Property(e => e.SLastName)
                .HasMaxLength(100)
                .HasColumnName("sLastName");
            entity.Property(e => e.SEmail)
                .HasMaxLength(150)
                .HasColumnName("sEmail");
            entity.Property(e => e.SPasswordHash)
                .HasMaxLength(255)
                .HasColumnName("sPasswordHash");
            entity.Property(e => e.SRole)
                .HasMaxLength(50)
                .HasColumnName("sRole");

            entity.HasOne(d => d.NDepartment).WithMany(p => p.TmEmployees)
                .HasForeignKey(d => d.NDepartmentId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_Employees_Department");
        });

        modelBuilder.Entity<TmProduct>(entity =>
        {
            entity.ToTable("tmProducts");
            entity.HasKey(e => e.NProductId);

            entity.HasIndex(e => e.NDefaultSupplierId, "FK_Products_Supplier");

            entity.HasIndex(e => e.SProductCode, "sProductCode").IsUnique();

            entity.Property(e => e.NProductId).HasColumnName("nProductId");
            entity.Property(e => e.DtCreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("dtCreatedAt");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValue(true)
                .HasColumnName("isActive");
            entity.Property(e => e.NDefaultSupplierId).HasColumnName("nDefaultSupplierId");
            entity.Property(e => e.SProductCode)
                .HasMaxLength(50)
                .HasColumnName("sProductCode");
            entity.Property(e => e.SProductName)
                .HasMaxLength(255)
                .HasColumnName("sProductName");
            entity.Property(e => e.SUnit)
                .HasMaxLength(50)
                .HasColumnName("sUnit");
            entity.Property(e => e.DUnitPrice)
                .HasPrecision(12, 2)
                .HasColumnName("dUnitPrice");
            entity.Property(e => e.SCategory)
                .HasMaxLength(100)
                .HasColumnName("sCategory");
            entity.Property(e => e.SImageUrl)
                .HasMaxLength(500)
                .HasColumnName("sImageUrl");

            entity.HasOne(d => d.NDefaultSupplier).WithMany(p => p.TmProducts)
                .HasForeignKey(d => d.NDefaultSupplierId)
                .HasConstraintName("FK_Products_Supplier");
        });

        modelBuilder.Entity<TmSupplier>(entity =>
        {
            entity.ToTable("tmSuppliers");
            entity.HasKey(e => e.NSupplierId);

            entity.HasIndex(e => e.SSupplierCode, "sSupplierCode").IsUnique();

            entity.Property(e => e.NSupplierId).HasColumnName("nSupplierId");
            entity.Property(e => e.DtCreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("dtCreatedAt");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValue(true)
                .HasColumnName("isActive");
            entity.Property(e => e.SAddress)
                .HasColumnType("text")
                .HasColumnName("sAddress");
            entity.Property(e => e.SBranch)
                .HasMaxLength(100)
                .HasColumnName("sBranch");
            entity.Property(e => e.SContactName)
                .HasMaxLength(150)
                .HasColumnName("sContactName");
            entity.Property(e => e.SPaymentMethod)
                .HasMaxLength(50)
                .HasColumnName("sPaymentMethod");
            entity.Property(e => e.SPaymentTerm)
                .HasMaxLength(100)
                .HasColumnName("sPaymentTerm");
            entity.Property(e => e.SSupplierCode)
                .HasMaxLength(50)
                .HasColumnName("sSupplierCode");
            entity.Property(e => e.SSupplierName)
                .HasMaxLength(255)
                .HasColumnName("sSupplierName");
            entity.Property(e => e.STelFax)
                .HasMaxLength(100)
                .HasColumnName("sTelFax");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
