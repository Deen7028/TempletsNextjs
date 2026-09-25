'use client';

import React from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Pagination,
  FormControl,
} from '@mui/material';

interface ICustomPaginationProps {
  nPage: number; // 0-indexed
  nRowsPerPage: number;
  nTotal: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newSize: number) => void;
  rowsPerPageOptions?: number[];
}

export const CustomPagination: React.FC<ICustomPaginationProps> = ({
  nPage,
  nRowsPerPage,
  nTotal,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50],
}) => {
  const nTotalPages = Math.max(1, Math.ceil(nTotal / nRowsPerPage));
  const nFrom = nTotal === 0 ? 0 : nPage * nRowsPerPage + 1;
  const nTo = Math.min((nPage + 1) * nRowsPerPage, nTotal);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: 2.5,
        py: 2,
        bgcolor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        borderRadius: '0 0 16px 16px',
        width: '100%',
      }}
    >
      {/* ฝั่งซ้าย: ตัวเลือกแสดงต่อหน้า + จำนวนรายการ */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.85rem' }}>
          แสดงต่อหน้า:
        </Typography>
        <FormControl size="small">
          <Select
            value={nRowsPerPage}
            onChange={(e) => {
              onRowsPerPageChange(Number(e.target.value));
              onPageChange(0);
            }}
            sx={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#1e293b',
              borderRadius: 2,
              bgcolor: '#f8fafc',
              '& .MuiSelect-select': { py: 0.5, px: 1.5 },
              '& fieldset': { borderColor: '#cbd5e1' },
              '&:hover fieldset': { borderColor: '#94a3b8' },
            }}
          >
            {rowsPerPageOptions.map((opt) => (
              <MenuItem key={opt} value={opt} sx={{ fontSize: '0.85rem' }}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600, fontSize: '0.85rem', ml: 0.5 }}>
          {nFrom} - {nTo} จาก {nTotal} รายการ
        </Typography>
      </Box>

      {/* ฝั่งขวา: ปุ่มกดเลขหน้า (ฟิตบรรทัดเดียว ไม่ต้องเลื่อนแกน X) */}
      <Box sx={{ display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
        <Pagination
          count={nTotalPages}
          page={Math.min(nPage + 1, nTotalPages)}
          onChange={(_, page) => onPageChange(page - 1)}
          color="primary"
          shape="rounded"
          size="small"
          siblingCount={0}
          boundaryCount={1}
          showFirstButton
          showLastButton
          sx={{
            '& .MuiPagination-ul': {
              flexWrap: 'nowrap',
              justifyContent: 'center',
            },
            '& .MuiPaginationItem-root': {
              fontWeight: 600,
              fontSize: '0.8rem',
              borderRadius: 1.5,
              color: '#475569',
              minWidth: 28,
              height: 28,
              px: 0.5,
              mx: 0.1,
              '&.Mui-selected': {
                bgcolor: '#2563eb',
                color: '#ffffff',
                fontWeight: 700,
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                '&:hover': {
                  bgcolor: '#1d4ed8',
                },
              },
              '&:hover': {
                bgcolor: '#f1f5f9',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};
