'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Paper,
  TableRow,
} from '@mui/material';
import { CustomPagination } from '@/shared/components';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { IProduct } from '@/modules/products';
import { ICartItem } from '../context/CartContext';

interface IProductSearchProps {
  lstProducts: IProduct[];
  cartItems?: ICartItem[];
  nPage?: number;
  nRowsPerPage?: number;
  nTotalProducts?: number;
  sSearch?: string;
  onSearchChange?: (val: string) => void;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newSize: number) => void;
  onAddToCart: (objProduct: IProduct, nQuantity: number) => void;
  onUpdateCartQty?: (nProductId: number, nQuantity: number) => void;
  onRemoveFromCart?: (nProductId: number) => void;
  onSubmitPR?: () => void;
}

export const ProductSearchContainer: React.FC<IProductSearchProps> = ({
  lstProducts,
  cartItems = [],
  nPage = 0,
  nRowsPerPage = 10,
  nTotalProducts = 0,
  sSearch = '',
  onSearchChange,
  onPageChange,
  onRowsPerPageChange,
  onAddToCart,
}) => {
  const [sKeywordLocal, setSKeywordLocal] = useState<string>('');
  const [nQuantities, setNQuantities] = useState<Record<number, number>>({});
  const [addedItemMap, setAddedItemMap] = useState<Record<number, boolean>>({});

  const activeKeyword = sSearch !== undefined ? sSearch : sKeywordLocal;

  const handleQuantityChange = (nProductId: number, nVal: number) => {
    setNQuantities((prev) => ({
      ...prev,
      [nProductId]: Math.max(1, nVal),
    }));
  };

  const handleAdd = (objProduct: IProduct, qty: number) => {
    onAddToCart(objProduct, qty);
    setAddedItemMap((prev) => ({ ...prev, [objProduct.nProductId]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [objProduct.nProductId]: false }));
    }, 1200);
  };

  const lstFilteredProducts = lstProducts.filter(
    (objItem) =>
      !activeKeyword ||
      objItem.sProductName.toLowerCase().includes(activeKeyword.toLowerCase()) ||
      objItem.sProductCode.includes(activeKeyword)
  );

  return (
    <Box sx={{ mx: 'auto', px: { xs: 1, sm: 2, md: 3 }, width: '100%' }}>
      {/* ส่วนหัวหน้าสั่งซื้อ & แถบค้นหา + ปุ่มตะกร้า */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#174785',
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              lineHeight: 1.2,
            }}
          >
            สั่งซื้อสินค้า (PR)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: '0.82rem', sm: '0.88rem' } }}>
            เลือกสินค้าและระบุจำนวนที่ต้องการขอสั่งซื้อเข้าคลัง
          </Typography>
        </Box>
      </Box>

      {/* ช่องค้นหาสินค้า */}
      <TextField
        fullWidth
        placeholder="ค้นหาด้วยรหัสสินค้า หรือชื่อสินค้า (เช่น โค้ก, ไข่ไก่, 59215)..."
        value={sSearch !== undefined ? sSearch : sKeywordLocal}
        onChange={(e) => {
          setSKeywordLocal(e.target.value);
          onSearchChange?.(e.target.value);
        }}
        size="medium"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#64748b' }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          mb: 3,
          bgcolor: '#ffffff',
          borderRadius: 2.5,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2.5,
          },
        }}
      />

      {/* 1. มุมมองจอคอมพิวเตอร์ (PC Desktop: md+) */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          }}
        >
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2, width: 100 }}>
                  รหัสสินค้า
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2 }}>
                  รายการสินค้า
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2, width: 110, textAlign: 'center' }}>
                  หน่วย
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', py: 2, width: 270, textAlign: 'center' }}>
                  จำนวน / ดำเนินการ
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lstFilteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                    <Inventory2Icon sx={{ fontSize: 44, mb: 1, display: 'block', mx: 'auto' }} />
                    ไม่พบข้อมูลสินค้าที่ค้นหา &ldquo;{activeKeyword}&rdquo;
                  </TableCell>
                </TableRow>
              ) : (
                lstFilteredProducts.map((objProduct) => {
                  const nProductId = objProduct.nProductId;
                  const nCurrentQty = nQuantities[nProductId] || 1;
                  const isAdded = !!addedItemMap[nProductId];

                  return (
                    <TableRow
                      key={nProductId}
                      hover
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        transition: 'background-color 0.15s',
                      }}
                    >
                      {/* 1. รหัสสินค้า */}
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          label={objProduct.sProductCode}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            bgcolor: '#f1f5f9',
                            color: '#1e293b',
                            borderRadius: 1.5,
                          }}
                        />
                      </TableCell>

                      {/* 2. รายการสินค้า */}
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.94rem' }}>
                          {objProduct.sProductName}
                        </Typography>
                      </TableCell>

                      {/* 3. หน่วย */}
                      <TableCell align="center" sx={{ py: 2 }}>
                        <Chip
                          label={objProduct.sUnit}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.78rem',
                            bgcolor: '#ecfdf5',
                            color: '#047857',
                            borderRadius: 1.5,
                          }}
                        />
                      </TableCell>

                      {/* 4. เพิ่มลงตะกร้า */}
                      <TableCell align="center" sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          {/* Stepper ปรับจำนวน */}
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              bgcolor: '#f8fafc',
                              border: '1px solid #cbd5e1',
                              borderRadius: 2,
                              p: 0.2,
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(nProductId, nCurrentQty - 1)}
                              disabled={nCurrentQty <= 1}
                              sx={{ p: 0.5 }}
                            >
                              <RemoveIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            <TextField
                              type="number"
                              size="small"
                              value={nCurrentQty}
                              onChange={(e) => handleQuantityChange(nProductId, parseInt(e.target.value) || 1)}
                              slotProps={{
                                input: { disableUnderline: true },
                                htmlInput: { min: 1, style: { textAlign: 'center', padding: '2px 0', width: 40, fontSize: '0.88rem' } },
                              }}
                              variant="standard"
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(nProductId, nCurrentQty + 1)}
                              sx={{ p: 0.5 }}
                            >
                              <AddIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>

                          {/* ปุ่มเพิ่ม */}
                          <Button
                            variant={isAdded ? 'outlined' : 'contained'}
                            color={isAdded ? 'success' : 'primary'}
                            size="small"
                            startIcon={isAdded ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <AddIcon sx={{ fontSize: 16 }} />}
                            onClick={() => handleAdd(objProduct, nCurrentQty)}
                            sx={{
                              borderRadius: 2,
                              px: 1.8,
                              py: 0.7,
                              fontWeight: 600,
                              textTransform: 'none',
                              fontSize: '0.85rem',
                              bgcolor: isAdded ? undefined : '#2563eb',
                              '&:hover': {
                                bgcolor: isAdded ? undefined : '#1d4ed8',
                              },
                            }}
                          >
                            {isAdded ? 'เพิ่ม' : 'เพิ่ม'}
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* 2. มุมมองมือถือ / แท็บเล็ต */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
        {lstFilteredProducts.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 5, borderRadius: 3, border: '1px dashed #cbd5e1' }}>
            <Inventory2Icon sx={{ fontSize: 44, color: '#94a3b8', mb: 1 }} />
            <Typography variant="body1" color="text.secondary">
              ไม่พบข้อมูลสินค้าที่ค้นหา &ldquo;{activeKeyword}&rdquo;
            </Typography>
          </Card>
        ) : (
          lstFilteredProducts.map((objProduct) => {
            const nProductId = objProduct.nProductId;
            const nCurrentQty = nQuantities[nProductId] || 1;
            const isAdded = !!addedItemMap[nProductId];

            return (
              <Card
                key={nProductId}
                sx={{
                  borderRadius: 2.5,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                <CardContent sx={{ p: { xs: 1.8, sm: 2 }, '&:last-child': { pb: { xs: 1.8, sm: 2 } } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={`รหัส: ${objProduct.sProductCode}`}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        height: 22,
                        bgcolor: '#f1f5f9',
                        color: '#1e293b',
                        borderRadius: 1.2,
                      }}
                    />
                    <Chip
                      label={`หน่วย: ${objProduct.sUnit}`}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.72rem',
                        height: 22,
                        bgcolor: '#ecfdf5',
                        color: '#047857',
                        borderRadius: 1.2,
                      }}
                    />
                  </Box>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: '#1e293b',
                      fontSize: '0.98rem',
                      lineHeight: 1.35,
                      mb: 1.8,
                    }}
                  >
                    {objProduct.sProductName}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.2,
                      justifyContent: 'space-between',
                      pt: 1.2,
                      borderTop: '1px solid #f1f5f9',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: 2,
                        p: 0.2,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(nProductId, nCurrentQty - 1)}
                        disabled={nCurrentQty <= 1}
                        sx={{ p: 0.6 }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <TextField
                        type="number"
                        size="small"
                        value={nCurrentQty}
                        onChange={(e) => handleQuantityChange(nProductId, parseInt(e.target.value) || 1)}
                        slotProps={{
                          input: { disableUnderline: true },
                          htmlInput: { min: 1, style: { textAlign: 'center', padding: '4px 0', width: 60 } },
                        }}
                        variant="standard"
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(nProductId, nCurrentQty + 1)}
                        sx={{ p: 0.6 }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Button
                      variant={isAdded ? 'outlined' : 'contained'}
                      color={isAdded ? 'success' : 'primary'}
                      size="medium"
                      startIcon={isAdded ? <CheckCircleIcon /> : <AddIcon />}
                      onClick={() => handleAdd(objProduct, nCurrentQty)}
                      sx={{
                        borderRadius: 2,
                        flex: 1,
                        width: 250,
                        py: 0.8,
                        fontWeight: 600,
                        textTransform: 'none',
                        bgcolor: isAdded ? undefined : '#2563eb',
                        '&:hover': {
                          bgcolor: isAdded ? undefined : '#1d4ed8',
                        },
                      }}
                    >
                      {isAdded ? 'เพิ่มแล้ว' : 'เพิ่ม'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })
        )}
      </Box>

      {/* แถบเปลี่ยนเลขหน้า (CustomPagination) */}
      <Box sx={{ mt: 3, borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <CustomPagination
          nPage={nPage}
          nRowsPerPage={nRowsPerPage}
          nTotal={nTotalProducts || lstProducts.length}
          onPageChange={(newPage) => onPageChange?.(newPage)}
          onRowsPerPageChange={(newSize) => onRowsPerPageChange?.(newSize)}
        />
      </Box>
    </Box>
  );
};
