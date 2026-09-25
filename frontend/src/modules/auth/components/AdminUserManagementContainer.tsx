'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
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
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Avatar,
  InputAdornment,
} from '@mui/material';
import { LogoLoader, CustomPagination } from '@/shared/components';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { authService } from '../services/authService';
import { IEmployeeItem, IDepartment } from '../interfaces/IAuth';

export const AdminUserManagementContainer: React.FC = () => {
  const { objUser } = useAuth();
  const objRouter = useRouter();
  const isAdmin = objUser?.sRole === 'Admin';

  const [lstEmployees, setLstEmployees] = useState<IEmployeeItem[]>([]);
  const [lstDepartments, setLstDepartments] = useState<IDepartment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sSearch, setSSearch] = useState<string>('');

  const [nPage, setNPage] = useState<number>(0);
  const [nRowsPerPage, setNRowsPerPage] = useState<number>(10);
  const [nTotalEmployees, setNTotalEmployees] = useState<number>(0);

  // Dialog แก้ไขบัญชีผู้ใช้
  const [editEmployee, setEditEmployee] = useState<IEmployeeItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isEditSaving, setIsEditSaving] = useState<boolean>(false);
  const [sEditError, setSEditError] = useState<string>('');

  // Notification Snackbar
  const [sNotification, setSNotification] = useState<string>('');
  const [sError, setSError] = useState<string>('');

  const loadData = async (page: number = nPage, pageSize: number = nRowsPerPage, search: string = sSearch) => {
    setIsLoading(true);
    try {
      const [empRes, deptData] = await Promise.all([
        authService.getEmployees(search, undefined, page + 1, pageSize),
        authService.getDepartments(),
      ]);
      setLstEmployees(empRes.data);
      setNTotalEmployees(empRes.total);
      setLstDepartments(deptData);
    } catch (err: any) {
      setSError('ไม่สามารถโหลดข้อมูลผู้ใช้งานได้: ' + (err?.message || ''));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(nPage, nRowsPerPage, sSearch);
  }, [nPage, nRowsPerPage, sSearch]);

  const handleOpenEdit = (emp: IEmployeeItem) => {
    setEditEmployee({ ...emp });
    setSEditError('');
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setEditEmployee(null);
    setSEditError('');
  };

  const handleSaveEdit = async () => {
    if (!editEmployee) return;
    setSEditError('');

    if (!editEmployee.sFirstName?.trim() || !editEmployee.sLastName?.trim()) {
      setSEditError('กรุณากรอกชื่อและนามสกุล');
      return;
    }

    setIsEditSaving(true);
    try {
      await authService.updateEmployee({
        nEmployeeId: editEmployee.nEmployeeId,
        sFirstName: editEmployee.sFirstName.trim(),
        sLastName: editEmployee.sLastName.trim(),
        sRole: editEmployee.sRole,
        nDepartmentId: editEmployee.nDepartmentId,
        isActive: editEmployee.isActive,
      });

      setSNotification('อัปเดตข้อมูลผู้ใช้งานสำเร็จเรียบร้อยแล้ว');
      handleCloseEdit();
      loadData();
    } catch (err: any) {
      setSEditError(err?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsEditSaving(false);
    }
  };

  const handleToggleStatus = async (emp: IEmployeeItem) => {
    const nextStatus = !emp.isActive;
    try {
      await authService.toggleEmployeeStatus(emp.nEmployeeId, nextStatus);
      setSNotification(`${nextStatus ? 'เปิดใช้งาน' : 'ปิดการใช้งาน'} บัญชี ${emp.sEmail} เรียบร้อยแล้ว`);
      setLstEmployees((prev) =>
        prev.map((item) =>
          item.nEmployeeId === emp.nEmployeeId ? { ...item, isActive: nextStatus } : item
        )
      );
    } catch (err: any) {
      setSError(err?.message || 'ไม่สามารถเปลี่ยนสถานะผู้ใช้งานได้');
    }
  };

  const filteredEmployees = lstEmployees.filter((emp) => {
    const query = sSearch.toLowerCase().trim();
    if (!query) return true;
    const fullName = `${emp.sFirstName || ''} ${emp.sLastName || ''}`.toLowerCase();
    const email = (emp.sEmail || '').toLowerCase();
    const dept = (emp.sDepartmentName || '').toLowerCase();
    const role = (emp.sRole || '').toLowerCase();
    return fullName.includes(query) || email.includes(query) || dept.includes(query) || role.includes(query);
  });

  if (!isAdmin) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '65vh',
          px: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5 },
            maxWidth: 480,
            width: '100%',
            textAlign: 'center',
            borderRadius: 4,
            border: '1px solid #fee2e2',
            bgcolor: '#fffafb',
            boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.08)',
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2.5,
            }}
          >
            <LockPersonIcon sx={{ fontSize: 38 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#991b1b', mb: 1 }}>
            ไม่มีสิทธิ์เข้าถึงหน้านี้
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 3.5, lineHeight: 1.6 }}>
            หน้าจัดการบัญชีผู้ใช้งานสงวนสิทธิ์เฉพาะผู้ดูแลระบบระดับสูง (Admin Only) เท่านั้น
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => objRouter.push('/admin/requests')}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.1,
              bgcolor: '#2563eb',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
              '&:hover': {
                bgcolor: '#1d4ed8',
              },
            }}
          >
            กลับสู่หน้ารายการคำขอ (PR)
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ mx: 'auto', px: { xs: 1.5, sm: 2.5 }, py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <ManageAccountsIcon sx={{ color: '#174785', fontSize: 34 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#174785' }}>
              จัดการบัญชีผู้ใช้งาน (User Accounts)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              กำหนดสิทธิ์การใช้งาน (Role), สังกัดแผนก และเปิด/ปิดการเข้าใช้งานระบบ
            </Typography>
          </Box>
        </Box>

        {/* กล่องค้นหา */}
        <TextField
          size="small"
          placeholder="ค้นหาชื่อ, อีเมล, แผนก หรือ Role..."
          value={sSearch}
          onChange={(e) => setSSearch(e.target.value)}
          sx={{ width: { xs: '100%', sm: 280 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {sError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSError('')}>{sError}</Alert>}

      {/* ตารางแสดงรายชื่อผู้ใช้ */}
      {isLoading ? (
        <Box sx={{ py: 6 }}>
          <LogoLoader sMessage="กำลังโหลดข้อมูลผู้ใช้งาน..." />
        </Box>
      ) : lstEmployees.length === 0 ? (
        <Card sx={{ borderRadius: 3, border: '1px dashed #cbd5e1', boxShadow: 'none', py: 6, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {sSearch ? 'ไม่พบข้อมูลผู้ใช้งานที่ตรงกับคำค้นหา' : 'ยังไม่มีข้อมูลผู้ใช้งานในระบบ'}
          </Typography>
        </Card>
      ) : (
        <>
          {/* Desktop & Tablet View Table */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
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
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 70, textAlign: 'center' }}>
                      ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8 }}>
                      ผู้ใช้งาน
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8 }}>
                      อีเมล (Login)
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 170 }}>
                      แผนกสังกัด
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 130, textAlign: 'center' }}>
                      สิทธิ์ (Role)
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 140, textAlign: 'center' }}>
                      สถานะบัญชี
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 110, textAlign: 'center' }}>
                      จัดการ
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lstEmployees.map((emp) => (
                    <TableRow
                      key={emp.nEmployeeId}
                      hover
                      sx={{
                        bgcolor: !emp.isActive ? 'rgba(241, 245, 249, 0.6)' : 'inherit',
                      }}
                    >
                      <TableCell align="center" sx={{ py: 1.8, color: '#64748b' }}>
                        {emp.nEmployeeId}
                      </TableCell>
                      <TableCell sx={{ py: 1.8 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              bgcolor: emp.sRole === 'Admin' ? '#174785' : '#0284c7',
                            }}
                          >
                            {(emp.sFirstName?.[0] || 'U').toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: emp.isActive ? '#1e293b' : '#94a3b8' }}>
                              {emp.sFirstName} {emp.sLastName}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.8, color: emp.isActive ? '#475569' : '#94a3b8', fontSize: '0.88rem' }}>
                        {emp.sEmail}
                      </TableCell>
                      <TableCell sx={{ py: 1.8 }}>
                        <Chip
                          label={emp.sDepartmentName || `แผนก ID ${emp.nDepartmentId}`}
                          size="small"
                          sx={{
                            fontSize: '0.75rem',
                            bgcolor: '#f1f5f9',
                            color: '#334155',
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.8 }}>
                        {emp.sRole === 'Admin' ? (
                          <Chip
                            icon={<AdminPanelSettingsIcon sx={{ fontSize: '16px !important' }} />}
                            label="Admin"
                            size="small"
                            sx={{
                              fontWeight: 700,
                              bgcolor: '#fef3c7',
                              color: '#b45309',
                              borderRadius: 1.5,
                            }}
                          />
                        ) : emp.sRole === 'Manager' ? (
                          <Chip
                            icon={<SupervisorAccountIcon sx={{ fontSize: '16px !important' }} />}
                            label="Manager"
                            size="small"
                            sx={{
                              fontWeight: 700,
                              bgcolor: '#ede9fe',
                              color: '#6d28d9',
                              borderRadius: 1.5,
                            }}
                          />
                        ) : (
                          <Chip
                            icon={<PersonIcon sx={{ fontSize: '16px !important' }} />}
                            label="Employee"
                            size="small"
                            sx={{
                              fontWeight: 600,
                              bgcolor: '#e0f2fe',
                              color: '#0369a1',
                              borderRadius: 1.5,
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.8 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title={emp.isActive ? 'คลิกเพื่อปิดใช้งานบัญชี' : 'คลิกเพื่อเปิดใช้งานบัญชี'}>
                            <Switch
                              checked={emp.isActive}
                              onChange={() => handleToggleStatus(emp)}
                              size="small"
                              color="success"
                            />
                          </Tooltip>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 700,
                              color: emp.isActive ? '#16a34a' : '#dc2626',
                              minWidth: 55,
                              textAlign: 'left',
                            }}
                          >
                            {emp.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.8 }}>
                        <Tooltip title="แก้ไขข้อมูลบัญชีผู้ใช้">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(emp)}
                            sx={{ color: '#2563eb', '&:hover': { bgcolor: '#eff6ff' } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Mobile View Cards */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
            {lstEmployees.map((emp) => (
              <Card
                key={emp.nEmployeeId}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  bgcolor: !emp.isActive ? 'rgba(241, 245, 249, 0.6)' : '#ffffff',
                  p: 2,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                {/* หัวการ์ด: รูป, ชื่อ, ID, และปุ่มแก้ไข */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        fontSize: '1rem',
                        fontWeight: 700,
                        bgcolor: emp.sRole === 'Admin' ? '#174785' : '#0284c7',
                      }}
                    >
                      {(emp.sFirstName?.[0] || 'U').toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: emp.isActive ? '#1e293b' : '#94a3b8' }}>
                        {emp.sFirstName} {emp.sLastName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        รหัสพนักงาน: #{emp.nEmployeeId}
                      </Typography>
                    </Box>
                  </Box>

                  <IconButton
                    size="small"
                    onClick={() => handleOpenEdit(emp)}
                    sx={{ color: '#2563eb', bgcolor: '#eff6ff' }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* อีเมลและแผนก */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, mb: 1.5 }}>
                  <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                    <b>อีเมล:</b> {emp.sEmail}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                      <b>แผนก:</b>
                    </Typography>
                    <Chip
                      label={emp.sDepartmentName || `แผนก ID ${emp.nDepartmentId}`}
                      size="small"
                      sx={{
                        fontSize: '0.72rem',
                        height: 22,
                        bgcolor: '#f1f5f9',
                        color: '#334155',
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                </Box>

                {/* แถวล่าง: Role และ Toggle Switch */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pt: 1.5,
                    borderTop: '1px solid #f1f5f9',
                  }}
                >
                  <Box>
                    {emp.sRole === 'Admin' ? (
                      <Chip
                        icon={<AdminPanelSettingsIcon sx={{ fontSize: '15px !important' }} />}
                        label="Admin"
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          height: 24,
                          bgcolor: '#fef3c7',
                          color: '#b45309',
                          borderRadius: 1.5,
                        }}
                      />
                    ) : emp.sRole === 'Manager' ? (
                      <Chip
                        icon={<SupervisorAccountIcon sx={{ fontSize: '15px !important' }} />}
                        label="Manager"
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          height: 24,
                          bgcolor: '#ede9fe',
                          color: '#6d28d9',
                          borderRadius: 1.5,
                        }}
                      />
                    ) : (
                      <Chip
                        icon={<PersonIcon sx={{ fontSize: '15px !important' }} />}
                        label="Employee"
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          height: 24,
                          bgcolor: '#e0f2fe',
                          color: '#0369a1',
                          borderRadius: 1.5,
                        }}
                      />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Switch
                      checked={emp.isActive}
                      onChange={() => handleToggleStatus(emp)}
                      size="small"
                      color="success"
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: emp.isActive ? '#16a34a' : '#dc2626',
                        minWidth: 50,
                      }}
                    >
                      {emp.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>

          <Box sx={{ mt: 2, borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <CustomPagination
              nPage={nPage}
              nRowsPerPage={nRowsPerPage}
              nTotal={nTotalEmployees}
              onPageChange={(newPage) => setNPage(newPage)}
              onRowsPerPageChange={(newSize) => setNRowsPerPage(newSize)}
            />
          </Box>
        </>
      )}

      {/* Modal แก้ไขบัญชีผู้ใช้ */}
      <Dialog open={isEditOpen} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#174785', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          แก้ไขข้อมูลบัญชีผู้ใช้ ({editEmployee?.sEmail})
        </DialogTitle>
        <DialogContent dividers>
          {sEditError && <Alert severity="error" sx={{ mb: 2 }}>{sEditError}</Alert>}
          {editEmployee && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  fullWidth
                  required
                  label="ชื่อจริง"
                  value={editEmployee.sFirstName || ''}
                  onChange={(e) => setEditEmployee({ ...editEmployee, sFirstName: e.target.value })}
                  size="small"
                />
                <TextField
                  fullWidth
                  required
                  label="นามสกุล"
                  value={editEmployee.sLastName || ''}
                  onChange={(e) => setEditEmployee({ ...editEmployee, sLastName: e.target.value })}
                  size="small"
                />
              </Box>

              <TextField
                fullWidth
                disabled
                label="อีเมล (ใช้เข้าสู่ระบบ)"
                value={editEmployee.sEmail || ''}
                size="small"
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                {/* เลือกสิทธิ์การใช้งาน (Role) */}
                <FormControl fullWidth size="small">
                  <InputLabel>สิทธิ์การใช้งาน (Role)</InputLabel>
                  <Select
                    label="สิทธิ์การใช้งาน (Role)"
                    value={editEmployee.sRole || 'Employee'}
                    onChange={(e) => setEditEmployee({ ...editEmployee, sRole: e.target.value })}
                  >
                    <MenuItem value="Employee">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon fontSize="small" sx={{ color: '#0284c7' }} />
                        Employee (พนักงานทั่วไป)
                      </Box>
                    </MenuItem>
                    <MenuItem value="Manager">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SupervisorAccountIcon fontSize="small" sx={{ color: '#6d28d9' }} />
                        Manager (ผู้จัดการ/อนุมัติ PR)
                      </Box>
                    </MenuItem>
                    <MenuItem value="Admin">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AdminPanelSettingsIcon fontSize="small" sx={{ color: '#d97706' }} />
                        Admin (ผู้ดูแลระบบสูงสุด)
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>

                {/* เลือกสังกัดแผนก */}
                <FormControl fullWidth size="small">
                  <InputLabel>สังกัดแผนก</InputLabel>
                  <Select
                    label="สังกัดแผนก"
                    value={editEmployee.nDepartmentId ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditEmployee({
                        ...editEmployee,
                        nDepartmentId: !val ? null : Number(val),
                      });
                    }}
                  >
                    <MenuItem value="">
                      <em>-- ไม่ระบุแผนก --</em>
                    </MenuItem>
                    {lstDepartments.map((d) => (
                      <MenuItem key={d.nDepartmentId} value={d.nDepartmentId}>
                        {d.sDepartmentName} ({d.sDepartmentCode})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* สถานะเปิด/ปิดใช้งาน */}
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editEmployee.isActive}
                      onChange={(e) => setEditEmployee({ ...editEmployee, isActive: e.target.checked })}
                      color="success"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {editEmployee.isActive ? 'สถานะ: เปิดใช้งานบัญชี (Active)' : 'สถานะ: ปิดการใช้งานบัญชี (Inactive)'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        หากปิดการใช้งาน ผู้ใช้จะไม่สามารถเข้าสู่ระบบและสั่งของได้
                      </Typography>
                    </Box>
                  }
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

      {/* Snackbar แจ้งเตือน */}
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
