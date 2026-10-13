"use client";

import React from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  IconButton,
  ButtonBase,
  SelectChangeEvent,
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export interface ICustomPaginationProps {
  nPage: number; // 0-based or 1-based (we normalize to 1-based internally if page is passed as 0 or 1)
  nRowsPerPage: number;
  nTotal: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newSize: number) => void;
  rowsPerPageOptions?: number[];
  isZeroBased?: boolean; // Default true to maintain compatibility with MUI TablePagination
}

export const CustomPagination: React.FC<ICustomPaginationProps> = ({
  nPage,
  nRowsPerPage,
  nTotal,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 20, 50, 100],
  isZeroBased = true,
}) => {
  // Normalize current page to 1-based for display and calculations
  const currentPage = isZeroBased ? nPage + 1 : Math.max(1, nPage);
  const totalPages = Math.max(1, Math.ceil(nTotal / (nRowsPerPage || 10)));

  // Range calculation: e.g. "1 - 10 จาก 171 รายการ"
  const startItem = nTotal === 0 ? 0 : (currentPage - 1) * nRowsPerPage + 1;
  const endItem = Math.min(currentPage * nRowsPerPage, nTotal);

  const handlePageClick = (pageTarget: number) => {
    if (pageTarget < 1 || pageTarget > totalPages || pageTarget === currentPage) return;
    onPageChange(isZeroBased ? pageTarget - 1 : pageTarget);
  };

  const handleRowsChange = (event: SelectChangeEvent<number>) => {
    const newSize = Number(event.target.value);
    onRowsPerPageChange(newSize);
  };

  // Generate pagination items with ellipses (...)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        py: 1.5,
        px: { xs: 1.5, sm: 2.5 },
        bgcolor: "#ffffff",
        borderRadius: "var(--radius-lg, 12px)",
        border: "1px solid #e2e8f0",
        flexWrap: "wrap",
        gap: 1.5,
      }}
    >
      {/* Left side: Rows per page selector and item range */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
        <Typography
          variant="body2"
          sx={{ color: "#64748b", fontWeight: 500, fontSize: "0.88rem" }}
        >
          แสดงต่อหน้า:
        </Typography>

        <Select
          value={nRowsPerPage}
          onChange={handleRowsChange}
          size="small"
          sx={{
            minWidth: 70,
            height: 34,
            borderRadius: "17px",
            bgcolor: "#f8fafc",
            color: "#1e293b",
            fontSize: "0.88rem",
            fontWeight: 600,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#cbd5e1",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#94a3b8",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#2563eb",
            },
            "& .MuiSelect-select": {
              py: 0.6,
              px: 1.5,
              display: "flex",
              alignItems: "center",
            },
          }}
        >
          {rowsPerPageOptions.map((opt) => (
            <MenuItem key={opt} value={opt} sx={{ fontSize: "0.88rem", fontWeight: 500 }}>
              {opt}
            </MenuItem>
          ))}
        </Select>

        <Typography
          variant="body2"
          sx={{ color: "#334155", fontWeight: 600, fontSize: "0.88rem", ml: 0.5 }}
        >
          {startItem} - {endItem} จาก {nTotal.toLocaleString()} รายการ
        </Typography>
      </Box>

      {/* Right side: Navigation buttons & Page pills */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {/* First Page button */}
        <IconButton
          size="small"
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1}
          aria-label="First page"
          sx={{
            color: "#94a3b8",
            p: 0.6,
            "&:hover": { color: "#2563eb", bgcolor: "#eff6ff" },
            "&.Mui-disabled": { color: "#cbd5e1" },
          }}
        >
          <FirstPageIcon fontSize="small" />
        </IconButton>

        {/* Prev Page button */}
        <IconButton
          size="small"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          sx={{
            color: "#94a3b8",
            p: 0.6,
            "&:hover": { color: "#2563eb", bgcolor: "#eff6ff" },
            "&.Mui-disabled": { color: "#cbd5e1" },
          }}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>

        {/* Page Numbers */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mx: 0.5 }}>
          {getPageNumbers().map((p, idx) => {
            if (typeof p === "string") {
              return (
                <Typography
                  key={`ellipsis-${idx}`}
                  sx={{
                    px: 0.8,
                    color: "#94a3b8",
                    fontSize: "0.88rem",
                    userSelect: "none",
                  }}
                >
                  •••
                </Typography>
              );
            }

            const isSelected = p === currentPage;
            return (
              <ButtonBase
                key={p}
                onClick={() => handlePageClick(p)}
                sx={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "50%",
                  fontSize: "0.88rem",
                  fontWeight: isSelected ? 700 : 500,
                  bgcolor: isSelected ? "#2563eb" : "transparent",
                  color: isSelected ? "#ffffff" : "#475569",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    bgcolor: isSelected ? "#1d4ed8" : "#f1f5f9",
                    color: isSelected ? "#ffffff" : "#1e293b",
                  },
                }}
              >
                {p}
              </ButtonBase>
            );
          })}
        </Box>

        {/* Next Page button */}
        <IconButton
          size="small"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          sx={{
            color: "#94a3b8",
            p: 0.6,
            "&:hover": { color: "#2563eb", bgcolor: "#eff6ff" },
            "&.Mui-disabled": { color: "#cbd5e1" },
          }}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>

        {/* Last Page button */}
        <IconButton
          size="small"
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
          sx={{
            color: "#94a3b8",
            p: 0.6,
            "&:hover": { color: "#2563eb", bgcolor: "#eff6ff" },
            "&.Mui-disabled": { color: "#cbd5e1" },
          }}
        >
          <LastPageIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CustomPagination;
