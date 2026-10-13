"use client";

import React, { useState } from "react";
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Checkbox,
  IconButton,
  TableSortLabel,
  Skeleton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CustomPagination } from "../Pagination/page";
import { ITableHeader, ITableRows, initRows } from "./hooks/useTable";

export * from "./hooks/useTable";

export interface ITableProps {
  id?: string;
  header: ITableHeader[];
  rows?: ITableRows;
  isLoading?: boolean;
  onLoadData?: (params: ITableRows) => void;
  isPage?: boolean;
  isShowCheckBox?: boolean;
  onDelete?: (ids: string[]) => void;
  renderRow?: (
    row: any,
    index: number,
    helpers?: {
      isSelected: boolean;
      renderCheckbox: () => React.ReactNode;
    }
  ) => React.ReactNode;
}

export default function Table({
  id,
  header,
  rows = initRows,
  isLoading = false,
  onLoadData,
  isPage = true,
  isShowCheckBox = false,
  onDelete,
  renderRow,
}: ITableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = rows.arrRows
        .map((r: any) => r.id || r.sKeyId || r.sFeatureID)
        .filter(Boolean);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (rowId: string) => {
    setSelectedIds((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
    );
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    if (onLoadData) {
      onLoadData({
        ...rows,
        nPageIndex: newPage + 1,
      });
    }
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onLoadData) {
      onLoadData({
        ...rows,
        nPageIndex: 1,
        nPageSize: parseInt(e.target.value, 10),
      });
    }
  };

  const handleSort = (columnId: string) => {
    if (onLoadData) {
      const isAsc =
        rows.sSortExpression === columnId && rows.sSortDirection === "asc";
      onLoadData({
        ...rows,
        sSortExpression: columnId,
        sSortDirection: isAsc ? "desc" : "asc",
      });
    }
  };

  return (
    <Paper
      id={id}
      elevation={0}
      sx={{
        width: "100%",
        overflow: "hidden",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        backgroundColor: "var(--color-surface)",
      }}
    >
      {isShowCheckBox && selectedIds.length > 0 && onDelete && (
        <div
          style={{
            padding: "8px 16px",
            backgroundColor: "var(--color-primary-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: 500 }}>
            เลือกแล้ว {selectedIds.length} รายการ
          </span>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(selectedIds)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      )}

      <TableContainer>
        <MuiTable>
          <TableHead sx={{ backgroundColor: "var(--color-surface-hover)" }}>
            <TableRow>
              {isShowCheckBox && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedIds.length > 0 &&
                      selectedIds.length < rows.arrRows.length
                    }
                    checked={
                      rows.arrRows.length > 0 &&
                      selectedIds.length === rows.arrRows.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {header.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || "left"}
                  style={{ width: col.width, fontWeight: 600 }}
                >
                  {col.isSortable ? (
                    <TableSortLabel
                      active={rows.sSortExpression === col.id}
                      direction={
                        rows.sSortExpression === col.id
                          ? rows.sSortDirection
                          : "asc"
                      }
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {isShowCheckBox && (
                    <TableCell padding="checkbox">
                      <Skeleton variant="rounded" width={20} height={20} />
                    </TableCell>
                  )}
                  {header.map((col) => (
                    <TableCell key={col.id}>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.arrRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={header.length + (isShowCheckBox ? 1 : 0)}
                  align="center"
                  sx={{ py: 6, color: "var(--color-text-secondary)" }}
                >
                  ไม่พบข้อมูล
                </TableCell>
              </TableRow>
            ) : (
              rows.arrRows.map((row: any, index: number) => {
                const rowKey =
                  row.id || row.sKeyId || row.sFeatureID || String(index);
                const isSelected = selectedIds.includes(rowKey);

                const renderCheckbox = () => (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleSelectRow(rowKey)}
                    />
                  </TableCell>
                );

                if (renderRow) {
                  return renderRow(row, index, { isSelected, renderCheckbox });
                }

                return (
                  <TableRow key={rowKey} hover selected={isSelected}>
                    {isShowCheckBox && renderCheckbox()}
                    {header.map((col) => (
                      <TableCell key={col.id} align={col.align || "left"}>
                        {row[col.id] ?? "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>

      {isPage && (
        <Box sx={{ p: 1.5, borderTop: "1px solid var(--color-border, #e2e8f0)" }}>
          <CustomPagination
            nPage={rows.nPageIndex - 1}
            nRowsPerPage={rows.nPageSize}
            nTotal={rows.nDataLength}
            onPageChange={(newPage) => handleChangePage(null, newPage)}
            onRowsPerPageChange={(newSize) => {
              handleChangeRowsPerPage({ target: { value: String(newSize) } } as any);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Box>
      )}
    </Paper>
  );
}
