'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import InventoryIcon from '@mui/icons-material/Inventory';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IProduct } from '../interfaces/IProduct';
import { productService } from '../services/productService';

export const AdminProductManagementContainer: React.FC = () => {
  const [lstProducts, setLstProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Form เพิ่มสินค้า
  const [objForm, setObjForm] = useState<{
    sProductCode: string;
    sProductName: string;
    sUnit: string;
    sCategory: string;
    nDefaultSupplierId: number;
  }>({
    sProductCode: '',
    sProductName: '',
    sUnit: '',
    sCategory: '',
    nDefaultSupplierId: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [sNotification, setSNotification] = useState<string>('');
  const [sError, setSError] = useState<string>('');

  // Dialog แก้ไขสินค้า
  const [editProduct, setEditProduct] = useState<IProduct | null>(null);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isEditSaving, setIsEditSaving] = useState<boolean>(false);
  const [sEditError, setSEditError] = useState<string>('');

  // Dialog ยืนยันการลบ
  const [deleteProductTarget, setDeleteProductTarget] = useState<IProduct | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getProducts();
      setLstProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (objEvent: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = objEvent.target;
    setObjForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitProduct = async (objEvent: React.FormEvent) => {
    objEvent.preventDefault();
    setSError('');
    setSNotification('');

    if (!objForm.sProductCode.trim() || !objForm.sProductName.trim() || !objForm.sUnit.trim()) {
      setSError('กรุณากรอกข้อมูลรหัสสินค้า ชื่อสินค้า และหน่วยนับให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);
    try {
      await productService.createProduct({
        ...objForm,
      });
      setSNotification('เพิ่มข้อมูลสินค้าใหม่สำเร็จเรียบร้อยแล้ว');
      setObjForm({ sProductCode: '', sProductName: '', sUnit: '', sCategory: '', nDefaultSupplierId: 1 });
      loadProducts();
    } catch (objErr: any) {
      setSError(objErr?.message || 'ไม่สามารถบันทึกข้อมูลสินค้าได้');
    } finally {
      setIsSubmitting(false);
    }
  };

  // จัดการการแก้ไข
  const handleOpenEdit = (product: IProduct) => {
    setEditProduct({ ...product });
    setSEditError('');
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setEditProduct(null);
    setSEditError('');
  };

  const handleEditChange = (objEvent: React.ChangeEvent<HTMLInputElement>) => {
    if (!editProduct) return;
    const { name, value } = objEvent.target;
    setEditProduct((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSaveEdit = async () => {
    if (!editProduct) return;
    setSEditError('');

    if (!editProduct.sProductName.trim() || !editProduct.sUnit.trim()) {
      setSEditError('กรุณากรอกชื่อสินค้า และหน่วยนับ');
      return;
    }

    setIsEditSaving(true);
    try {
      await productService.updateProduct(editProduct.nProductId, {
        sProductName: editProduct.sProductName,
        sUnit: editProduct.sUnit,
        sCategory: editProduct.sCategory || '',
      });
      setSNotification('อัปเดตข้อมูลสินค้าสำเร็จเรียบร้อยแล้ว');
      handleCloseEdit();
      loadProducts();
    } catch (err: any) {
      setSEditError(err?.message || 'ไม่สามารถอัปเดตข้อมูลสินค้าได้');
    } finally {
      setIsEditSaving(false);
    }
  };

  // จัดการการลบ
  const handleOpenDelete = (product: IProduct) => {
    setDeleteProductTarget(product);
    setIsDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setDeleteProductTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteProductTarget) return;
    setIsDeleting(true);
    try {
      const res = await productService.deleteProduct(deleteProductTarget.nProductId);
      setSNotification(res.message || 'ลบข้อมูลสินค้าเรียบร้อยแล้ว');
      handleCloseDelete();
      loadProducts();
    } catch (err: any) {
      setSError(err?.message || 'เกิดข้อผิดพลาดในการลบสินค้า');
      handleCloseDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box sx={{ mx: 'auto', px: { xs: 1.5, sm: 2.5 }, py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 3 }}>
        <AddBoxIcon sx={{ color: '#174785', fontSize: 32 }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#174785' }}>
            จัดการข้อมูลสินค้า (Admin)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            เพิ่มข้อมูลสินค้าใหม่ และแก้ไข/ลบรายการสินค้าในระบบ
          </Typography>
        </Box>
      </Box>

      {/* ฟอร์มเพิ่มสินค้าใหม่ */}
      <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', mb: 4 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
            เพิ่มสินค้าใหม่เข้าสู่ระบบ (TmProducts)
          </Typography>

          {sError && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{sError}</Alert>}

          <Box component="form" onSubmit={handleSubmitProduct} noValidate>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                gap: 2,
              }}
            >
              <Box>
                <TextField
                  fullWidth
                  required
                  label="รหัสสินค้า (Product Code เช่น 901427)"
                  name="sProductCode"
                  value={objForm.sProductCode}
                  onChange={handleChange}
                  size="small"
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  required
                  label="หน่วยนับ (Unit เช่น ถาด, แพ็ค, ถุง, กล่อง)"
                  name="sUnit"
                  value={objForm.sUnit}
                  onChange={handleChange}
                  size="small"
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="หมวดหมู่ (Category เช่น ของสด / วัตถุดิบ, เครื่องดื่ม)"
                  name="sCategory"
                  value={objForm.sCategory}
                  onChange={handleChange}
                  size="small"
                />
              </Box>
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <TextField
                  fullWidth
                  required
                  label="ชื่อรายการสินค้า"
                  name="sProductName"
                  value={objForm.sProductName}
                  onChange={handleChange}
                  size="small"
                />
              </Box>
            </Box>

            <Box sx={{ mt: 2.5 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                size="large"
                startIcon={<AddBoxIcon />}
                sx={{
                  py: 1.2,
                  px: 3,
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: '#2563eb',
                  '&:hover': { bgcolor: '#1d4ed8' },
                }}
              >
                {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกเพิ่มสินค้า'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* ตารางแสดงรายการสินค้าทั้งหมด */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <InventoryIcon sx={{ color: '#475569', fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
            รายการสินค้าทั้งหมดในระบบ ({lstProducts.length} รายการ)
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : lstProducts.length === 0 ? (
          <Card sx={{ borderRadius: 3, border: '1px dashed #cbd5e1', boxShadow: 'none', py: 6, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              ยังไม่มีข้อมูลสินค้าในระบบ
            </Typography>
          </Card>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            }}
          >
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 140 }}>รหัสสินค้า</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8 }}>ชื่อรายการสินค้า</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 180 }}>หมวดหมู่</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 100, textAlign: 'center' }}>
                    หน่วย
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 110, textAlign: 'center' }}>
                    จัดการ
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lstProducts.map((p) => (
                  <TableRow key={p.nProductId} hover>
                    <TableCell sx={{ py: 1.8 }}>
                      <Chip
                        label={p.sProductCode}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          bgcolor: '#f1f5f9',
                          color: '#1e293b',
                          borderRadius: 1.5,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1.8, fontWeight: 600, color: '#1e293b' }}>
                      {p.sProductName}
                    </TableCell>
                    <TableCell sx={{ py: 1.8 }}>
                      {p.sCategory ? (
                        <Chip
                          label={p.sCategory}
                          size="small"
                          sx={{
                            fontSize: '0.72rem',
                            bgcolor: '#f8fafc',
                            color: '#475569',
                            border: '1px solid #e2e8f0',
                          }}
                        />
                      ) : (
                        <Typography variant="caption" color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center" sx={{ py: 1.8 }}>
                      <Chip
                        label={p.sUnit}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          bgcolor: '#ecfdf5',
                          color: '#047857',
                          borderRadius: 1.5,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ py: 1.8 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        <Tooltip title="แก้ไขข้อมูล">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(p)}
                            sx={{ color: '#2563eb', '&:hover': { bgcolor: '#eff6ff' } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="ลบข้อมูล">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDelete(p)}
                            sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Modal แก้ไขสินค้า */}
      <Dialog open={isEditOpen} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#174785' }}>
          แก้ไขข้อมูลสินค้า ({editProduct?.sProductCode})
        </DialogTitle>
        <DialogContent dividers>
          {sEditError && <Alert severity="error" sx={{ mb: 2 }}>{sEditError}</Alert>}
          {editProduct && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                required
                label="ชื่อรายการสินค้า"
                name="sProductName"
                value={editProduct.sProductName}
                onChange={handleEditChange}
                size="small"
              />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  fullWidth
                  required
                  label="หน่วยนับ"
                  name="sUnit"
                  value={editProduct.sUnit}
                  onChange={handleEditChange}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="หมวดหมู่"
                  name="sCategory"
                  value={editProduct.sCategory || ''}
                  onChange={handleEditChange}
                  size="small"
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseEdit} color="inherit" disabled={isEditSaving}>
            ยกเลิก
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            disabled={isEditSaving}
            sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }}
          >
            {isEditSaving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal ยืนยันการลบ */}
      <Dialog open={isDeleteOpen} onClose={handleCloseDelete} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#dc2626' }}>
          ยืนยันการลบสินค้า
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#475569' }}>
            คุณต้องการลบสินค้า <strong>{deleteProductTarget?.sProductName}</strong> ({deleteProductTarget?.sProductCode}) ใช่หรือไม่?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDelete} color="inherit" disabled={isDeleting}>
            ยกเลิก
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? 'กำลังลบ...' : 'ยืนยันลบ'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!sNotification}
        autoHideDuration={3000}
        onClose={() => setSNotification('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', borderRadius: 2 }}>
          {sNotification}
        </Alert>
      </Snackbar>
    </Box>
  );
};
