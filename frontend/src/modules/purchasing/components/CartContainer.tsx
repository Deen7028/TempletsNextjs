'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '@/modules/auth';
import { purchasingService } from '../services/purchasingService';
import { IPurchaseRequestItem } from '../interfaces/IPurchasing';

export const CartContainer: React.FC = () => {
  const objRouter = useRouter();
  const { objUser } = useAuth();
  const { cartItems, updateCartQty, removeFromCart, clearCart, nTotalItems } = useCart();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [sNotification, setSNotification] = useState<string>('');
  const [sError, setSError] = useState<string>('');

  // ยืนยันการส่งคำขอสั่งซื้อ (PR)
  const handleConfirmSubmit = async () => {
    if (!objUser?.nEmployeeId) {
      setSError('กรุณาเข้าสู่ระบบก่อนส่งคำขอสั่งซื้อ');
      return;
    }

    if (cartItems.length === 0) {
      setSError('ไม่มีรายการสินค้าในตะกร้า');
      return;
    }

    setIsSubmitting(true);
    setSError('');

    const prItems: IPurchaseRequestItem[] = cartItems.map((item) => {
      const unitPrice = Number(item.objProduct.dUnitPrice || 0);
      const lineTotal = unitPrice * item.nQuantity;
      return {
        nProductId: item.objProduct.nProductId,
        sSnapshotProductName: item.objProduct.sProductName,
        sSnapshotUnit: item.objProduct.sUnit,
        dUnitPrice: unitPrice,
        nQuantity: item.nQuantity,
        dLineTotal: lineTotal,
      };
    });

    try {
      const res = await purchasingService.createPurchaseRequest({
        nDepartmentId: objUser.nDepartmentId,
        nRequestedByEmployeeId: objUser.nEmployeeId,
        sStatus: 'PENDING_APPROVAL',
        sRequestNo: '',
        lstItems: prItems,
      });

      const sSuccessMsg = res?.message || 'ส่งคำขอสั่งซื้อ (PR) สำเร็จเรียบร้อยแล้ว';
      setSNotification(sSuccessMsg);
      clearCart();
      setTimeout(() => {
        objRouter.push('/procurement');
      }, 1800);
    } catch (err: any) {
      setSError(err?.message || 'เกิดข้อผิดพลาดในการส่งคำขอสั่งซื้อ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ mx: 'auto', px: { xs: 1, sm: 2, md: 3 }, py: { xs: 1.5, sm: 2.5 }, width: '100%' }}>
      {/* ส่วนหัวหน้าตะกร้า */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            component={Link}
            href="/procurement"
            startIcon={<ArrowBackIcon />}
            sx={{
              color: '#475569',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': { bgcolor: '#f1f5f9' },
            }}
          >
            เลือกสินค้าเพิ่ม
          </Button>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#174785',
              fontSize: { xs: '1.2rem', sm: '1.45rem' },
            }}
          >
            ตะกร้าสินค้า ({cartItems.length} รายการ)
          </Typography>
        </Box>

        {cartItems.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
            onClick={clearCart}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            ล้างตะกร้า
          </Button>
        )}
      </Box>

      {sError && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
          {sError}
        </Alert>
      )}

      {cartItems.length === 0 ? (
        <Card
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
            borderRadius: 3,
            border: '1px dashed #cbd5e1',
            boxShadow: 'none',
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 64, color: '#94a3b8', mb: 1.5, opacity: 0.7 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#475569', mb: 0.5 }}>
            ไม่มีสินค้าในตะกร้า
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            ท่านยังไม่ได้เลือกสินค้าเพื่อจัดทำเอกสารขอสั่งซื้อ
          </Typography>
          <Button
            component={Link}
            href="/procurement"
            variant="contained"
            sx={{
              bgcolor: '#2563eb',
              '&:hover': { bgcolor: '#1d4ed8' },
              borderRadius: 2.5,
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            ไปหน้ารายการสินค้า
          </Button>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* 1. หน้าจอคอมพิวเตอร์ (PC Desktop: md+) */}
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
              <Table sx={{ minWidth: 700 }}>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 130 }}>
                      รหัสสินค้า
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8 }}>
                      รายการสินค้า
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 90, textAlign: 'center' }}>
                      หน่วย
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 110, textAlign: 'right' }}>
                      ราคา/หน่วย
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 160, textAlign: 'center' }}>
                      จำนวน
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 120, textAlign: 'right' }}>
                      รวมเงิน
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 70, textAlign: 'center' }}>
                      ลบ
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => {
                    const nProductId = item.objProduct.nProductId;
                    return (
                      <TableRow
                        key={nProductId}
                        hover
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        {/* รหัสสินค้า */}
                        <TableCell sx={{ py: 2 }}>
                          <Chip
                            label={item.objProduct.sProductCode}
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

                        {/* ชื่อสินค้า */}
                        <TableCell sx={{ py: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.94rem' }}>
                            {item.objProduct.sProductName}
                          </Typography>
                        </TableCell>

                        {/* หน่วย */}
                        <TableCell align="center" sx={{ py: 2 }}>
                          <Chip
                            label={item.objProduct.sUnit}
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

                        {/* ราคา/หน่วย */}
                        <TableCell align="right" sx={{ py: 2, fontWeight: 600, color: '#475569' }}>
                          ฿{Number(item.objProduct.dUnitPrice || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>

                        {/* Stepper ปรับจำนวน */}
                        <TableCell align="center" sx={{ py: 2 }}>
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
                              onClick={() => updateCartQty(nProductId, item.nQuantity - 1)}
                              disabled={item.nQuantity <= 1}
                              sx={{ p: 0.4 }}
                            >
                              <RemoveIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            <Typography
                              sx={{
                                px: 1.5,
                                fontSize: '0.92rem',
                                fontWeight: 700,
                                minWidth: 32,
                                textAlign: 'center',
                                color: '#1e293b',
                              }}
                            >
                              {item.nQuantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => updateCartQty(nProductId, item.nQuantity + 1)}
                              sx={{ p: 0.4 }}
                            >
                              <AddIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </TableCell>

                        {/* รวมเงิน */}
                        <TableCell align="right" sx={{ py: 2, fontWeight: 700, color: '#0f766e', fontSize: '0.95rem' }}>
                          ฿{(Number(item.objProduct.dUnitPrice || 0) * item.nQuantity).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>

                        {/* ปุ่มลบ */}
                        <TableCell align="center" sx={{ py: 2 }}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeFromCart(nProductId)}
                            sx={{
                              bgcolor: '#fef2f2',
                              '&:hover': { bgcolor: '#fee2e2' },
                              p: 0.8,
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* 2. หน้าจอเล็กกว่า PC (Mobile & Tablet: < md) */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
            {cartItems.map((item) => {
              const nProductId = item.objProduct.nProductId;
              return (
                <Card
                  key={nProductId}
                  sx={{
                    borderRadius: 2.5,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={`รหัส: ${item.objProduct.sProductCode}`}
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
                          label={`หน่วย: ${item.objProduct.sUnit}`}
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
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeFromCart(nProductId)}
                        sx={{ p: 0.5 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: '#1e293b',
                        fontSize: '0.96rem',
                        lineHeight: 1.35,
                        mb: 1,
                      }}
                    >
                      {item.objProduct.sProductName}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        ราคา/หน่วย: ฿{Number(item.objProduct.dUnitPrice || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f766e' }}>
                        รวม: ฿{(Number(item.objProduct.dUnitPrice || 0) * item.nQuantity).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        pt: 1.2,
                        borderTop: '1px solid #f1f5f9',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        จำนวนที่ขอสั่งซื้อ:
                      </Typography>

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
                          onClick={() => updateCartQty(nProductId, item.nQuantity - 1)}
                          disabled={item.nQuantity <= 1}
                          sx={{ p: 0.6 }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography
                          sx={{
                            px: 2,
                            fontSize: '0.92rem',
                            fontWeight: 700,
                            minWidth: 32,
                            textAlign: 'center',
                            color: '#1e293b',
                          }}
                        >
                          {item.nQuantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateCartQty(nProductId, item.nQuantity + 1)}
                          sx={{ p: 0.6 }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          {/* กล่องสรุปภาพรวมและปุ่มยืนยันส่งคำขอ PR */}
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
              bgcolor: '#ffffff',
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                  gap: 2,
                  mb: 2.5,
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    สังกัดแผนก
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {objUser?.sDepartmentName || '-'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    ผู้ขอสั่งซื้อ (Requested By)
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {objUser ? `${objUser.sFirstName} ${objUser.sLastName}` : 'พนักงาน'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    รวมทั้งสิ้น
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#2563eb' }}>
                    {cartItems.length} รายการ ({nTotalItems} ชิ้น)
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f766e', mt: 0.3 }}>
                    รวมประมาณการ ฿{cartItems.reduce((acc, it) => acc + (Number(it.objProduct.dUnitPrice || 0) * it.nQuantity), 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2.5 }} />

              <Button
                variant="contained"
                fullWidth
                size="large"
                disabled={isSubmitting || cartItems.length === 0}
                onClick={handleConfirmSubmit}
                startIcon={<CheckCircleIcon />}
                sx={{
                  py: 1.3,
                  fontWeight: 700,
                  fontSize: '1rem',
                  borderRadius: 2.5,
                  bgcolor: '#2563eb',
                  '&:hover': { bgcolor: '#1d4ed8' },
                  boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                }}
              >
                {isSubmitting ? 'กำลังส่งคำขอ...' : 'ยืนยันส่งคำขอสั่งซื้อ'}
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Snackbar แจ้งเตือน */}
      <Snackbar
        open={!!sNotification}
        autoHideDuration={2500}
        onClose={() => setSNotification('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSNotification('')} severity="success" sx={{ width: '100%', borderRadius: 2 }}>
          {sNotification}
        </Alert>
      </Snackbar>
    </Box>
  );
};
