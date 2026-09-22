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
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '@/modules/auth';
import { purchasingService } from '../services/purchasingService';
import { IPurchaseRequestItem } from '../interfaces/IPurchasing';

export const CartContainer: React.FC = () => {
  const objRouter = useRouter();
  const { objUser } = useAuth();
  const { cartItems, addToCart, updateCartQty, removeFromCart, clearCart, nTotalItems } = useCart();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [sNotification, setSNotification] = useState<string>('');
  const [sError, setSError] = useState<string>('');

  // สำหรับเพิ่มรายการสินค้าที่ไม่มีในระบบ (Custom / Off-Catalog Item)
  const [customItem, setCustomItem] = useState<{
    sProductName: string;
    sUnit: string;
    nQuantity: number | string;
    sRemarks: string;
  }>({
    sProductName: '',
    sUnit: '',
    nQuantity: 1,
    sRemarks: '',
  });

  const handleAddCustomItem = () => {
    if (!customItem.sProductName.trim()) {
      setSError('กรุณาระบุชื่อสินค้าหรือรายการที่ต้องการสั่ง');
      return;
    }
    const qty = Number(customItem.nQuantity);
    if (isNaN(qty) || qty <= 0) {
      setSError('กรุณาระบุจำนวนสินค้าที่ถูกต้อง (มากกว่า 0)');
      return;
    }

    const sUnitVal = customItem.sUnit.trim() || 'ชิ้น';
    // สร้าง Product จำลอง (nProductId ติดลบเพื่อให้มี ID ไม่ซ้ำในตะกร้า)
    const mockProduct: any = {
      nProductId: -Date.now(),
      sProductCode: 'CUSTOM',
      sProductName: customItem.sProductName.trim(),
      sUnit: sUnitVal,
      sCategory: 'รายการพิเศษ / สั่งนอกระบบ',
      sRemarks: customItem.sRemarks.trim() || undefined,
    };

    addToCart(mockProduct, qty);
    setCustomItem({
      sProductName: '',
      sUnit: '',
      nQuantity: 1,
      sRemarks: '',
    });
    setSNotification(`เพิ่มรายการ "${mockProduct.sProductName}" ลงในรายการขอซื้อแล้ว`);
  };

  // ยืนยันการส่งคำขอสั่งซื้อ (PR)
  const handleConfirmSubmit = async () => {
    if (!objUser?.nEmployeeId) {
      setSError('กรุณาเข้าสู่ระบบก่อนส่งคำขอสั่งซื้อ');
      return;
    }

    if (!objUser?.nDepartmentId || objUser.nDepartmentId <= 0) {
      setSError('บัญชีของคุณยังไม่ได้ระบุสังกัดแผนก กรุณาไปที่หน้าข้อมูลส่วนตัว (Profile) เพื่อเลือกแผนกก่อนทำการสั่งซื้อสินค้า');
      return;
    }

    if (cartItems.length === 0) {
      setSError('ไม่มีรายการสินค้าในตะกร้า');
      return;
    }

    setIsSubmitting(true);
    setSError('');

    try {
      const prItems: IPurchaseRequestItem[] = [];

      for (const item of cartItems) {
        // หากเป็นสินค้าพิเศษที่กรอกเองนอกระบบ (nProductId < 0) ให้ส่งเป็น null เพื่อไม่ให้ไปเพิ่มในตาราง Product
        const nProdId = item.objProduct.nProductId > 0 ? item.objProduct.nProductId : null;

        prItems.push({
          nProductId: nProdId,
          sProductCode: nProdId ? item.objProduct.sProductCode : 'OFF-CATALOG',
          sSnapshotProductName: item.objProduct.sProductName,
          sSnapshotUnit: item.objProduct.sUnit,
          nQuantity: item.nQuantity,
          sRemarks: item.objProduct.sRemarks || item.sRemarks || null,
        });
      }

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

      {/* กล่องแบบฟอร์ม: กรณีพนักงานต้องการสั่งของที่ไม่มีอยู่ในระบบ (Off-Catalog / Custom Item) */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          border: '1px solid #bfdbfe',
          bgcolor: '#f8fafc',
          boxShadow: '0 2px 8px rgba(37,99,235,0.06)',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            bgcolor: '#eff6ff',
            borderBottom: '1px solid #dbeafe',
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
          }}
        >
          <PlaylistAddIcon sx={{ color: '#2563eb', fontSize: 24 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e40af', fontSize: '0.98rem' }}>
              สั่งสินค้าที่ไม่มีอยู่ในระบบ (เพิ่มรายการพิเศษ)
            </Typography>
            <Typography variant="caption" sx={{ color: '#4b5563' }}>
              หากค้นหาในระบบแล้วไม่พบสินค้าที่ต้องการ สามารถกรอกข้อมูลสินค้าและจำนวนที่ต้องการขอซื้อได้ที่นี่
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* แถวที่ 1: ชื่อสินค้า, หน่วยนับ, จำนวน */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr' },
                gap: 2,
                alignItems: 'center',
              }}
            >
              <TextField
                fullWidth
                size="small"
                label="ชื่อสินค้า / รายการที่ต้องการสั่ง *"
                placeholder="เช่น ถ่าน AA, แปรงขัดห้องน้ำ, น้ำยาฆ่าเชื้อ"
                value={customItem.sProductName}
                onChange={(e) => setCustomItem({ ...customItem, sProductName: e.target.value })}
                sx={{ bgcolor: '#ffffff' }}
              />

              <TextField
                fullWidth
                size="small"
                label="หน่วยนับ *"
                placeholder="เช่น ชิ้น, กล่อง, แพ็ค"
                value={customItem.sUnit}
                onChange={(e) => setCustomItem({ ...customItem, sUnit: e.target.value })}
                sx={{ bgcolor: '#ffffff' }}
              />

              <TextField
                fullWidth
                size="small"
                type="number"
                label="จำนวน *"
                slotProps={{ htmlInput: { min: 1 } }}
                value={customItem.nQuantity}
                onChange={(e) => setCustomItem({ ...customItem, nQuantity: Math.max(1, parseInt(e.target.value) || 1) })}
                sx={{ bgcolor: '#ffffff' }}
              />
            </Box>

            {/* แถวที่ 2: หมายเหตุ และ ปุ่มเพิ่มรายการ */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
                gap: 2,
                alignItems: 'center',
              }}
            >
              <TextField
                fullWidth
                size="small"
                label="หมายเหตุ / สเปก / เหตุผลที่ต้องการ (ถ้ามี)"
                placeholder="เช่น สั่งด่วนสำหรับแผนก F&B, ยี่ห้อ Panasonic, ขนาด 500ml"
                value={customItem.sRemarks}
                onChange={(e) => setCustomItem({ ...customItem, sRemarks: e.target.value })}
                sx={{ bgcolor: '#ffffff' }}
              />

              <Button
                variant="contained"
                onClick={handleAddCustomItem}
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: '#2563eb',
                  '&:hover': { bgcolor: '#1d4ed8' },
                  borderRadius: 2,
                  fontWeight: 700,
                  py: 1,
                  px: 3,
                  whiteSpace: 'nowrap',
                  textTransform: 'none',
                  boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
                }}
              >
                เพิ่มรายการ
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

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
            ยังไม่มีสินค้าในรายการคำขอซื้อ
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            ท่านสามารถเลือกสินค้าจากระบบด้านล่าง หรือกรอกสั่งสินค้าพิเศษจากกล่องด้านบนได้ทันที
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
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 100, textAlign: 'center' }}>
                      หน่วย
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 180, textAlign: 'center' }}>
                      จำนวน
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 80, textAlign: 'center' }}>
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
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.94rem' }}>
                              {item.objProduct.sProductName}
                            </Typography>
                            {nProductId < 0 && (
                              <Chip
                                label="สั่งนอกระบบ"
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  bgcolor: '#fef3c7',
                                  color: '#b45309',
                                  borderRadius: 1,
                                }}
                              />
                            )}
                          </Box>
                          {(item.objProduct.sRemarks || item.sRemarks) && (
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.3 }}>
                              หมายเหตุ: {item.objProduct.sRemarks || item.sRemarks}
                            </Typography>
                          )}
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

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: '#1e293b',
                          fontSize: '0.96rem',
                          lineHeight: 1.35,
                        }}
                      >
                        {item.objProduct.sProductName}
                      </Typography>
                      {nProductId < 0 && (
                        <Chip
                          label="สั่งนอกระบบ"
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            bgcolor: '#fef3c7',
                            color: '#b45309',
                            borderRadius: 1,
                          }}
                        />
                      )}
                    </Box>

                    {(item.objProduct.sRemarks || item.sRemarks) && (
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1 }}>
                        หมายเหตุ: {item.objProduct.sRemarks || item.sRemarks}
                      </Typography>
                    )}

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
                  {objUser?.nDepartmentId && objUser.nDepartmentId > 0 ? (
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {objUser?.sDepartmentName || '-'}
                    </Typography>
                  ) : (
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#dc2626' }}>
                      ยังไม่ได้ระบุ (<Link href="/profile" style={{ color: '#2563eb', textDecoration: 'underline' }}>ไปตั้งค่าที่โปรไฟล์</Link>)
                    </Typography>
                  )}
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
