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
import BusinessIcon from '@mui/icons-material/Business';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IDepartment } from '../interfaces/IDepartment';
import { departmentService } from '../services/departmentService';

export const AdminDepartmentManagementContainer: React.FC = () => {
  const [lstDepartments, setLstDepartments] = useState<IDepartment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Form เพิ่มแผนก
  const [objForm, setObjForm] = useState<{
    sDepartmentCode: string;
    sDepartmentName: string;
  }>({
    sDepartmentCode: '',
    sDepartmentName: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [sNotification, setSNotification] = useState<string>('');
  const [sError, setSError] = useState<string>('');

  // Dialog แก้ไขแผนก
  const [editDept, setEditDept] = useState<IDepartment | null>(null);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isEditSaving, setIsEditSaving] = useState<boolean>(false);
  const [sEditError, setSEditError] = useState<string>('');

  // Dialog ยืนยันการลบ
  const [deleteDeptTarget, setDeleteDeptTarget] = useState<IDepartment | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadDepartments = async () => {
    setIsLoading(true);
    try {
      const data = await departmentService.getDepartments();
      setLstDepartments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleChange = (objEvent: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = objEvent.target;
    setObjForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitDepartment = async (objEvent: React.FormEvent) => {
    objEvent.preventDefault();
    setSError('');
    setSNotification('');

    if (!objForm.sDepartmentCode.trim() || !objForm.sDepartmentName.trim()) {
      setSError('กรุณากรอกรหัสแผนกและชื่อแผนกให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);
    try {
      await departmentService.createDepartment(objForm);
      setSNotification('เพิ่มข้อมูลแผนกใหม่สำเร็จเรียบร้อยแล้ว');
      setObjForm({ sDepartmentCode: '', sDepartmentName: '' });
      loadDepartments();
    } catch (objErr: any) {
      setSError(objErr?.message || 'ไม่สามารถบันทึกข้อมูลแผนกได้');
    } finally {
      setIsSubmitting(false);
    }
  };

  // จัดการการแก้ไข
  const handleOpenEdit = (dept: IDepartment) => {
    setEditDept({ ...dept });
    setSEditError('');
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setEditDept(null);
    setSEditError('');
  };

  const handleSaveEdit = async () => {
    if (!editDept) return;
    setSEditError('');

    if (!editDept.sDepartmentName.trim()) {
      setSEditError('กรุณากรอกชื่อแผนก');
      return;
    }

    setIsEditSaving(true);
    try {
      await departmentService.updateDepartment(editDept.nDepartmentId, {
        sDepartmentName: editDept.sDepartmentName.trim(),
      });
      setSNotification('อัปเดตข้อมูลแผนกเรียบร้อยแล้ว');
      handleCloseEdit();
      loadDepartments();
    } catch (err: any) {
      setSEditError(err?.message || 'ไม่สามารถอัปเดตข้อมูลแผนกได้');
    } finally {
      setIsEditSaving(false);
    }
  };

  // จัดการการลบ
  const handleOpenDelete = (dept: IDepartment) => {
    setDeleteDeptTarget(dept);
    setIsDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setDeleteDeptTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteDeptTarget) return;
    setIsDeleting(true);
    try {
      const res = await departmentService.deleteDepartment(deleteDeptTarget.nDepartmentId);
      setSNotification(res.message || 'ลบข้อมูลแผนกเรียบร้อยแล้ว');
      handleCloseDelete();
      loadDepartments();
    } catch (err: any) {
      setSError(err?.message || 'เกิดข้อผิดพลาดในการลบแผนก');
      handleCloseDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box sx={{ mx: 'auto', px: { xs: 1.5, sm: 2.5 }, py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 3 }}>
        <BusinessIcon sx={{ color: '#174785', fontSize: 32 }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#174785' }}>
            จัดการข้อมูลแผนก (Admin)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            เพิ่มข้อมูลแผนกใหม่ และแก้ไข/ลบรายการแผนกในระบบ
          </Typography>
        </Box>
      </Box>

      {/* ฟอร์มเพิ่มแผนก */}
      <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', mb: 4 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
            เพิ่มแผนกใหม่เข้าสู่ระบบ (TmDepartments)
          </Typography>

          {sError && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{sError}</Alert>}

          <Box component="form" onSubmit={handleSubmitDepartment} noValidate>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 2fr' },
                gap: 2,
              }}
            >
              <Box>
                <TextField
                  fullWidth
                  required
                  label="รหัสแผนก (Code เช่น F&B, FO, HK)"
                  name="sDepartmentCode"
                  value={objForm.sDepartmentCode}
                  onChange={handleChange}
                  size="small"
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  required
                  label="ชื่อแผนกเต็ม (Department Name เช่น Food & Beverage)"
                  name="sDepartmentName"
                  value={objForm.sDepartmentName}
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
                startIcon={<AddIcon />}
                sx={{
                  py: 1.2,
                  px: 3,
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: '#2563eb',
                  '&:hover': { bgcolor: '#1d4ed8' },
                }}
              >
                {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกเพิ่มแผนก'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* ตารางแสดงรายการแผนกทั้งหมด */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <BusinessIcon sx={{ color: '#475569', fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
            รายการแผนกทั้งหมดในระบบ ({lstDepartments.length} แผนก)
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : lstDepartments.length === 0 ? (
          <Card sx={{ borderRadius: 3, border: '1px dashed #cbd5e1', boxShadow: 'none', py: 6, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              ยังไม่มีข้อมูลแผนกในระบบ
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
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 80, textAlign: 'center' }}>
                    ลำดับ
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 160 }}>
                    รหัสแผนก
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8 }}>
                    ชื่อแผนก
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 110, textAlign: 'center' }}>
                    จัดการ
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lstDepartments.map((d, index) => (
                  <TableRow key={d.nDepartmentId} hover>
                    <TableCell align="center" sx={{ py: 1.8, color: '#64748b' }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ py: 1.8 }}>
                      <Chip
                        label={d.sDepartmentCode}
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
                    <TableCell sx={{ py: 1.8, fontWeight: 600, color: '#1e293b' }}>
                      {d.sDepartmentName}
                    </TableCell>
                    <TableCell align="center" sx={{ py: 1.8 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        <Tooltip title="แก้ไขข้อมูล">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(d)}
                            sx={{ color: '#2563eb', '&:hover': { bgcolor: '#eff6ff' } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="ลบข้อมูล">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDelete(d)}
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

      {/* Modal แก้ไขแผนก */}
      <Dialog open={isEditOpen} onClose={handleCloseEdit} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#174785' }}>
          แก้ไขชื่อแผนก ({editDept?.sDepartmentCode})
        </DialogTitle>
        <DialogContent dividers>
          {sEditError && <Alert severity="error" sx={{ mb: 2 }}>{sEditError}</Alert>}
          {editDept && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                disabled
                label="รหัสแผนก"
                value={editDept.sDepartmentCode}
                size="small"
              />
              <TextField
                fullWidth
                required
                label="ชื่อแผนก"
                value={editDept.sDepartmentName}
                onChange={(e) => setEditDept({ ...editDept, sDepartmentName: e.target.value })}
                size="small"
              />
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
          ยืนยันการลบแผนก
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#475569' }}>
            คุณต้องการลบแผนก <strong>{deleteDeptTarget?.sDepartmentName}</strong> ({deleteDeptTarget?.sDepartmentCode}) ใช่หรือไม่?
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
