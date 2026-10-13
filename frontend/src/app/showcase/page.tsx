"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useForm, FormProvider } from "react-hook-form";
import {
  Box,
  Typography,
  Chip,
  Divider,
  Paper,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import WidgetsIcon from "@mui/icons-material/Widgets";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import CodeIcon from "@mui/icons-material/Code";
import PaletteIcon from "@mui/icons-material/Palette";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Handbook Standard Shared Components
import Grid from "@/shared/components/Grid";
import Card from "@/shared/components/Card";
import {
  BaseButton,
  BtnSearch,
  BtnClear,
  BtnAdd,
  BtnSave,
  BtnDelete,
  BtnBack,
} from "@/shared/components/BaseButton";
import {
  TextBoxItem,
  TextAreaItem,
  SelectItem,
  DatePickerItem,
  CheckBoxItem,
} from "@/shared/components/Input";
import { Show, Each } from "@/shared/components/common";
import { BlockUI } from "@/shared/components/BlockUI";
import { PopupAlert, PopupDelete } from "@/shared/components/Popup/pate";
import { LogoLoader } from "@/shared/components/LogoLoader";
import {
  KpiCardSkeleton,
  TransactionRowSkeleton,
  ChartSkeleton,
} from "@/shared/components/SkeletonCard";
import { ErrorState } from "@/shared/components/ErrorState";
import { CustomPagination } from "@/shared/components/Pagination/page";
import LinkCustom from "@/shared/components/LinkCustom";
import { ITableHeader, ITableRows, initRows } from "@/shared/components/Table";

const Table = dynamic(() => import("@/shared/components/Table"), {
  ssr: false,
});

interface IDemoForm {
  sCode: string;
  sName: string;
  sCategory: string;
  dDate: string;
  sDescription: string;
  isActive: boolean;
}

interface IDemoRow {
  id: string;
  code: string;
  title: string;
  category: string;
  status: "Active" | "Pending" | "Inactive";
  price: number;
}

const sampleTableData: IDemoRow[] = [
  { id: "1", code: "PRD-001", title: "Premium Wireless Keyboard", category: "Hardware", status: "Active", price: 2500 },
  { id: "2", code: "PRD-002", title: "Ergonomic Optical Mouse", category: "Hardware", status: "Active", price: 1200 },
  { id: "3", code: "PRD-003", title: "UltraWide 4K IPS Monitor 34\"", category: "Display", status: "Pending", price: 18900 },
  { id: "4", code: "PRD-004", title: "Noise-Cancelling Headset Pro", category: "Audio", status: "Inactive", price: 4500 },
  { id: "5", code: "PRD-005", title: "Thunderbolt 4 Docking Station", category: "Accessories", status: "Active", price: 6900 },
];

export default function ShowcasePage() {
  // 1. Form state
  const form = useForm<IDemoForm>({
    defaultValues: {
      sCode: "DEMO-2026",
      sName: "Clean Architecture Starter Kit",
      sCategory: "template",
      dDate: new Date().toISOString().slice(0, 10),
      sDescription: "Comprehensive enterprise template built with Next.js 16 and MUI.",
      isActive: true,
    },
  });

  // 2. Table state
  const [dataRow, setDataRow] = useState<ITableRows<IDemoRow>>({
    ...initRows,
    arrRows: sampleTableData,
    nDataLength: sampleTableData.length,
    nPageIndex: 1,
    nPageSize: 5,
  });
  const [isTableLoading, setIsTableLoading] = useState(false);

  // 3. Showcase Interactive Controls
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showErrorState, setShowErrorState] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "pending">("all");

  const tableHeaders: ITableHeader[] = [
    { id: "code", label: "Product Code", width: "140px", isSortable: true },
    { id: "title", label: "Title / Name", isSortable: true },
    { id: "category", label: "Category", width: "130px" },
    { id: "status", label: "Status", width: "120px", align: "center" },
    { id: "price", label: "Price (THB)", width: "130px", align: "right", isSortable: true },
    { id: "action", label: "Actions", width: "120px", align: "center", isAction: true },
  ];

  const categoryOptions = [
    { label: "Hardware", value: "hardware" },
    { label: "Software / Template", value: "template" },
    { label: "Display & Monitor", value: "display" },
    { label: "Audio & Accessories", value: "audio" },
  ];

  // BlockUI Demo
  const triggerBlockUI = () => {
    BlockUI.Show("กำลังทดสอบ BlockUI Loader (2 วินาที)...");
    setTimeout(() => {
      BlockUI.Close();
      PopupAlert("BlockUI สำเร็จ", "การจำลอง Async Task เสร็จสิ้นแล้ว", "success");
    }, 2000);
  };

  // Popup Alert Demo
  const triggerPopupAlert = () => {
    PopupAlert(
      "บันทึกข้อมูลสำเร็จ",
      "ระบบทำการอัปเดตข้อมูลและกระจาย Event เรียบร้อยแล้ว",
      "success"
    );
  };

  // Popup Confirm Delete Demo
  const triggerPopupDelete = () => {
    PopupDelete(
      "ยืนยันการลบรายการนี้?",
      "คุณต้องการลบข้อมูลตัวอย่างนี้ออกจากระบบหรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้",
      () => {
        PopupAlert("ลบข้อมูลสำเร็จ", "รายการถูกลบออกจากฐานข้อมูลเรียบร้อย", "info");
      }
    );
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
      {/* Header Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          mb: 4,
          borderRadius: "var(--radius-xl, 16px)",
          background: "linear-gradient(135deg, #174785 0%, #1d4ed8 50%, #3b82f6 100%)",
          color: "#ffffff",
          boxShadow: "0 12px 30px -10px rgba(23, 71, 133, 0.4)",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { sm: "center" }, gap: 2 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Box
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  p: 1,
                  borderRadius: 2,
                  display: "inline-flex",
                }}
              >
                <WidgetsIcon sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
                Design System & Shared Components Showcase
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.9)", maxWidth: 850 }}>
              หน้ารวม UI Components มาตรฐานทั้งหมดตาม <strong>Handbook v2.0</strong> พร้อมฟังก์ชัน Interactive ทดสอบทั้ง Form Inputs, Buttons, Table, BlockUI, Popups, Skeleton และ Helpers
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              icon={<CheckCircleIcon sx={{ color: "#ffffff !important" }} />}
              label="Handbook Clean Architecture"
              sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", color: "#ffffff", fontWeight: 600 }}
            />
            <Chip
              label="Zero 'any' Types"
              sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", color: "#ffffff", fontWeight: 600 }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Control Switcher Bar */}
      <Card
        elevation={0}
        sx={{
          p: 2.5,
          mb: 4,
          borderRadius: "var(--radius-lg, 12px)",
          border: "1px solid var(--color-border, #e2e8f0)",
          backgroundColor: "var(--color-surface, #ffffff)",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { md: "center" }, gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TouchAppIcon color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "var(--color-text, #1e293b)" }}>
              Interactive Sandbox Controls:
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <FormControlLabel
              control={<Switch checked={showSkeleton} onChange={(e) => setShowSkeleton(e.target.checked)} color="primary" />}
              label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Skeleton Mode</Typography>}
            />
            <FormControlLabel
              control={<Switch checked={showErrorState} onChange={(e) => setShowErrorState(e.target.checked)} color="error" />}
              label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Error State View</Typography>}
            />
          </Box>
        </Box>
      </Card>

      {/* SECTION 1: ErrorState & Skeletons (Conditional View) */}
      <Show when={showErrorState}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <CodeIcon color="error" /> 1. ErrorState Component
          </Typography>
          <ErrorState
            sTitle="จำลองข้อผิดพลาดในการเชื่อมต่อ (ErrorState Demo)"
            sMessage="Component นี้จะแสดงผลอัตโนมัติเมื่อ Request มีปัญหาหรือ API คืนค่า Error ตามคู่มือ Handbook"
            sRetryText="ทดสอบโหลดใหม่"
            onRetry={() => setShowErrorState(false)}
          />
        </Box>
      </Show>

      <Show when={showSkeleton}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <PaletteIcon color="primary" /> 2. Skeleton Components (KPI, Table, Chart)
          </Typography>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", mb: 1, display: "block" }}>
                KPI Card Skeleton
              </Typography>
              <KpiCardSkeleton />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", mb: 1, display: "block" }}>
                Transaction Row Skeletons
              </Typography>
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <TransactionRowSkeleton />
                <TransactionRowSkeleton />
                <TransactionRowSkeleton />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", mb: 1, display: "block" }}>
                Chart Panel Skeleton
              </Typography>
              <ChartSkeleton />
            </Grid>
          </Grid>
        </Box>
      </Show>

      {/* SECTION 2: Standard BaseButton Variations */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <TouchAppIcon color="primary" /> 3. BaseButton Family (Standard Actions)
        </Typography>
        <Card
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "var(--radius-lg, 12px)",
            border: "1px solid var(--color-border, #e2e8f0)",
          }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
            <BtnSearch onClick={() => PopupAlert("Search Clicked", "สั่งค้นหาข้อมูลเรียบร้อย", "info")} />
            <BtnClear onClick={() => form.reset()} />
            <BtnAdd onClick={() => PopupAlert("Add Clicked", "เปิด Modal เพิ่มรายการ", "info")} />
            <BtnSave onClick={() => triggerPopupAlert()} />
            <BtnDelete onClick={() => triggerPopupDelete()} />
            <BtnBack onClick={() => window.history.back()} />
            <BaseButton variant="contained" sx={{ bgcolor: "#8b5cf6", "&:hover": { bgcolor: "#7c3aed" } }}>
              Custom BaseButton
            </BaseButton>
            <BaseButton variant="outlined" color="secondary">
              Secondary Outlined
            </BaseButton>
          </Box>
          <Divider sx={{ my: 2.5 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: "text.secondary" }}>
            Icon-Only Variants (isIconOnly):
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <BtnSearch isIconOnly onClick={() => {}} />
            <BtnClear isIconOnly onClick={() => {}} />
            <BtnAdd isIconOnly onClick={() => {}} />
            <Typography variant="caption" sx={{ color: "text.secondary", ml: 1 }}>
              ใช้สำหรับปุ่มใน Toolbars หรือ Table Row Actions
            </Typography>
          </Box>
        </Card>
      </Box>

      {/* SECTION 3: Standard Form Inputs with FormProvider */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <CodeIcon color="primary" /> 4. Form Inputs Component System (with React Hook Form)
        </Typography>
        <Card
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "var(--radius-lg, 12px)",
            border: "1px solid var(--color-border, #e2e8f0)",
          }}
        >
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(() => triggerPopupAlert())}>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextBoxItem
                    name="sCode"
                    label="Product Code (TextBoxItem)"
                    required
                    placeholder="เช่น PRD-001"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextBoxItem
                    name="sName"
                    label="Product Name (TextBoxItem)"
                    required
                    placeholder="เช่น Apple MacBook Pro M3"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <SelectItem
                    name="sCategory"
                    label="Category (SelectItem)"
                    required
                    options={categoryOptions}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <DatePickerItem
                    name="dDate"
                    label="Release Date (DatePickerItem)"
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextAreaItem
                    name="sDescription"
                    label="Description (TextAreaItem)"
                    rows={2}
                    placeholder="รายละเอียดเพิ่มเติมของสินค้า"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CheckBoxItem
                    name="isActive"
                    label="เปิดใช้งานรายการนี้ทันที (CheckBoxItem)"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                    <BtnClear onClick={() => form.reset()} />
                    <BtnSave type="submit" />
                  </Box>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </Card>
      </Box>

      {/* SECTION 4: Feedback System (BlockUI & Popups) */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <WidgetsIcon color="primary" /> 5. Feedback & Dialogs (BlockUI + Popup Alert / Confirm)
        </Typography>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: "var(--radius-lg, 12px)",
                border: "1px solid var(--color-border, #e2e8f0)",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                BlockUI Overlay
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 2.5 }}>
                บล็อก UI ทั้งหน้าจอขณะประมวลผลพร้อมแอนิเมชัน LogoLoader
              </Typography>
              <BaseButton variant="contained" color="primary" fullWidth onClick={triggerBlockUI}>
                เรียก BlockUI.Show()
              </BaseButton>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: "var(--radius-lg, 12px)",
                border: "1px solid var(--color-border, #e2e8f0)",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                PopupAlert
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 2.5 }}>
                กล่องแจ้งเตือนผลลัพธ์การทำงาน (Success, Error, Info, Warning)
              </Typography>
              <BaseButton variant="contained" color="success" fullWidth onClick={triggerPopupAlert}>
                เรียก PopupAlert()
              </BaseButton>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: "var(--radius-lg, 12px)",
                border: "1px solid var(--color-border, #e2e8f0)",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                PopupDelete / Confirm
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 2.5 }}>
                กล่องยืนยันการลบหรือดำเนินการสำคัญ พร้อม Callback async
              </Typography>
              <BaseButton variant="contained" color="error" fullWidth onClick={triggerPopupDelete}>
                เรียก PopupDelete()
              </BaseButton>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* SECTION 5: Standard Dynamic Table & Pagination */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
            <WidgetsIcon color="primary" /> 6. Dynamic Table with Custom RenderRow
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              label="ทั้งหมด (5)"
              clickable
              color={activeTab === "all" ? "primary" : "default"}
              onClick={() => setActiveTab("all")}
            />
            <Chip
              label="Active (3)"
              clickable
              color={activeTab === "active" ? "success" : "default"}
              onClick={() => setActiveTab("active")}
            />
            <Chip
              label="Pending (1)"
              clickable
              color={activeTab === "pending" ? "warning" : "default"}
              onClick={() => setActiveTab("pending")}
            />
          </Box>
        </Box>

        <Table
          id="table-showcase"
          header={tableHeaders}
          rows={dataRow}
          isLoading={isTableLoading}
          isShowCheckBox
          onLoadData={(params) => {
            setIsTableLoading(true);
            setTimeout(() => {
              setDataRow((prev) => ({
                ...prev,
                nPageIndex: params.nPageIndex,
                nPageSize: params.nPageSize,
              }));
              setIsTableLoading(false);
            }, 400);
          }}
          renderRow={(row: IDemoRow, _index, helpers) => (
            <TableRow key={row.id} hover selected={helpers?.isSelected}>
              {helpers?.renderCheckbox()}
              <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                <LinkCustom href={`#`}>{row.code}</LinkCustom>
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{row.title}</TableCell>
              <TableCell>
                <Chip size="small" label={row.category} variant="outlined" />
              </TableCell>
              <TableCell align="center">
                <Chip
                  size="small"
                  label={row.status}
                  color={
                    row.status === "Active"
                      ? "success"
                      : row.status === "Pending"
                      ? "warning"
                      : "default"
                  }
                  sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                />
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                ฿{row.price.toLocaleString()}
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                  <Tooltip title="ดูรายละเอียด">
                    <IconButton size="small" color="primary">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="แก้ไข">
                    <IconButton size="small" color="info">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="ลบ">
                    <IconButton size="small" color="error" onClick={() => triggerPopupDelete()}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          )}
        />
        <Box sx={{ mt: 2.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "text.secondary" }}>
            Standalone CustomPagination (Demo 171 รายการตรงตามแบบ):
          </Typography>
          <CustomPagination
            nPage={0}
            nRowsPerPage={10}
            nTotal={171}
            onPageChange={(page) => console.log("Page change:", page)}
            onRowsPerPageChange={(size) => console.log("Size change:", size)}
            rowsPerPageOptions={[10, 20, 50, 100]}
          />
        </Box>
      </Box>

      {/* SECTION 6: Logic Helpers (Show / Each) & LogoLoader */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <CodeIcon color="primary" /> 7. Conditional & Loop Helpers (&lt;Show&gt;, &lt;Each&gt;) + LogoLoader
        </Typography>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "var(--radius-lg, 12px)",
                border: "1px solid var(--color-border, #e2e8f0)",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                &lt;Each&gt; Component Loop Example
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                วนลูป Render รายการข้อมูลโดยไม่ต้องเขียน .map() ดิบ
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Each
                  of={[
                    { title: "Clean Architecture Structure", badge: "Core" },
                    { title: "Zustand Global State Stores", badge: "State" },
                    { title: "Multi-Language i18n System", badge: "Localization" },
                    { title: "Full TypeScript Strict Safety", badge: "Types" },
                  ]}
                  render={(item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {idx + 1}. {item.title}
                      </Typography>
                      <Chip label={item.badge} size="small" color="primary" variant="outlined" />
                    </Box>
                  )}
                />
              </Box>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "var(--radius-lg, 12px)",
                border: "1px solid var(--color-border, #e2e8f0)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, width: "100%", textAlign: "left" }}>
                LogoLoader Component
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 2, width: "100%", textAlign: "left" }}>
                Pulse animation indicator สำหรับโหลดข้อมูลทั้งหน้า
              </Typography>
              <LogoLoader sMessage="กำลังแสดงผล LogoLoader..." />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
