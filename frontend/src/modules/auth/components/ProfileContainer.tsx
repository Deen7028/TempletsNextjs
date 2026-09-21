'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Avatar,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
  Chip,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SaveIcon from '@mui/icons-material/Save';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { IDepartment } from '../interfaces/IAuth';

export const ProfileContainer: React.FC = () => {
  const { objUser, updateUser } = useAuth();

  const [lstDepartments, setLstDepartments] = useState<IDepartment[]>([]);
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  const [sProfileSuccess, setSProfileSuccess] = useState<string>('');
  const [sProfileError, setSProfileError] = useState<string>('');

  const [sPasswordSuccess, setSPasswordSuccess] = useState<string>('');
  const [sPasswordError, setSPasswordError] = useState<string>('');

  // ฟอร์มข้อมูลส่วนตัว
  const [sFirstName, setSFirstName] = useState<string>(objUser?.sFirstName || '');
  const [sLastName, setSLastName] = useState<string>(objUser?.sLastName || '');
  const [nDepartmentId, setNDepartmentId] = useState<number>(objUser?.nDepartmentId || 1);

  // ฟอร์มเปลี่ยนรหัสผ่าน
  const [sCurrentPassword, setSCurrentPassword] = useState<string>('');
  const [sNewPassword, setSNewPassword] = useState<string>('');
  const [sConfirmNewPassword, setSConfirmNewPassword] = useState<string>('');
  const [isShowOldPass, setIsShowOldPass] = useState<boolean>(false);
  const [isShowNewPass, setIsShowNewPass] = useState<boolean>(false);

  // ดึงรายชื่อแผนกจาก Database
  React.useEffect(() => {
    authService.getDepartments().then((data) => {
      setLstDepartments(data);
    });
  }, []);

  // ซิงค์ค่าเมื่อ objUser โหลดเสร็จ
  React.useEffect(() => {
    if (objUser) {
      setSFirstName(objUser.sFirstName || '');
      setSLastName(objUser.sLastName || '');
      setNDepartmentId(objUser.nDepartmentId || 1);
    }
  }, [objUser]);

  // บันทึกข้อมูลส่วนตัว (ใช้ POST เท่านั้น)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSProfileSuccess('');
    setSProfileError('');

    if (!objUser?.nEmployeeId) {
      setSProfileError('ไม่พบข้อมูลรหัสพนักงาน กรุณาเข้าสู่ระบบใหม่อีกครั้ง');
      return;
    }

    if (!sFirstName.trim()) {
      setSProfileError('กรุณาระบุชื่อ');
      return;
    }
    if (!sLastName.trim()) {
      setSProfileError('กรุณาระบุนามสกุล');
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await authService.updateProfile({
        nEmployeeId: objUser.nEmployeeId,
        sFirstName: sFirstName.trim(),
        sLastName: sLastName.trim(),
        nDepartmentId,
      });

      if (res.status === 'success' || res.status === '200') {
        const deptName = lstDepartments.find((d) => d.nDepartmentId === nDepartmentId)?.sDepartmentName;
        updateUser({
          sFirstName: sFirstName.trim(),
          sLastName: sLastName.trim(),
          nDepartmentId,
          sDepartmentName: deptName || objUser.sDepartmentName,
        });
        setSProfileSuccess(res.message || 'บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว');
      } else {
        setSProfileError(res.message || 'ไม่สามารถบันทึกข้อมูลได้');
      }
    } catch (err: any) {
      setSProfileError(err?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // เปลี่ยนรหัสผ่าน (ใช้ POST เท่านั้น)
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSPasswordSuccess('');
    setSPasswordError('');

    if (!objUser?.nEmployeeId) {
      setSPasswordError('ไม่พบข้อมูลรหัสพนักงาน กรุณาเข้าสู่ระบบใหม่อีกครั้ง');
      return;
    }

    if (!sCurrentPassword) {
      setSPasswordError('กรุณาระบุรหัสผ่านปัจจุบัน');
      return;
    }
    if (sNewPassword.length < 6) {
      setSPasswordError('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    if (sNewPassword !== sConfirmNewPassword) {
      setSPasswordError('รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await authService.changePassword({
        nEmployeeId: objUser.nEmployeeId,
        sCurrentPassword,
        sNewPassword,
      });

      if (res.status === 'success' || res.status === '200') {
        setSPasswordSuccess(res.message || 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว');
        setSCurrentPassword('');
        setSNewPassword('');
        setSConfirmNewPassword('');
      } else {
        setSPasswordError(res.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้');
      }
    } catch (err: any) {
      setSPasswordError(err?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getInitials = () => {
    const first = sFirstName ? sFirstName[0] : (objUser?.sFirstName?.[0] || 'U');
    return first.toUpperCase();
  };

  return (
    <Box sx={{ maxWidth: 920, mx: 'auto', px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 2 }, width: '100%' }}>
      {/* ส่วนหัวแสดงบัตรพนักงาน */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
          mb: 3,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            bgcolor: '#174785',
            height: { xs: 80, sm: 100 },
            backgroundImage: 'linear-gradient(135deg, #174785 0%, #2563eb 100%)',
          }}
        />
        <CardContent sx={{ pt: 0, px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-end' },
              gap: 2,
              mt: { xs: -5, sm: -6 },
              mb: 2,
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Avatar
              sx={{
                width: { xs: 84, sm: 96 },
                height: { xs: 84, sm: 96 },
                bgcolor: '#2563eb',
                fontSize: { xs: '2rem', sm: '2.5rem' },
                fontWeight: 700,
                border: '4px solid #ffffff',
                boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
              }}
            >
              {getInitials()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {sFirstName || objUser?.sFirstName || 'ผู้ใช้งาน'} {sLastName || objUser?.sLastName || ''}
                </Typography>
                <Chip
                  icon={objUser?.sRole === 'Admin' ? <AdminPanelSettingsIcon sx={{ fontSize: '1rem !important' }} /> : <BadgeIcon sx={{ fontSize: '1rem !important' }} />}
                  label={objUser?.sRole || 'Employee'}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    bgcolor: objUser?.sRole === 'Admin' ? '#fef3c7' : '#e0f2fe',
                    color: objUser?.sRole === 'Admin' ? '#92400e' : '#0369a1',
                    borderRadius: 1.5,
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <EmailIcon sx={{ fontSize: 16 }} />
                {objUser?.sEmail || 'กำลังโหลดอีเมล...'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* กล่อง 2 คอลัมน์สำหรับ Desktop และแถวเดียวสำหรับ Mobile */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' },
          gap: 3,
        }}
      >
        {/* ฟอร์มแก้ไขข้อมูลส่วนตัว */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            border: '1px solid #e2e8f0',
            height: '100%',
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
              <PersonIcon sx={{ color: '#174785' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#174785' }}>
                ข้อมูลส่วนตัว
              </Typography>
            </Box>
            <Divider sx={{ mb: 2.5 }} />

            {sProfileSuccess && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                {sProfileSuccess}
              </Alert>
            )}
            {sProfileError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {sProfileError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSaveProfile} noValidate>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  fullWidth
                  required
                  label="ชื่อ (First Name)"
                  value={sFirstName}
                  onChange={(e) => setSFirstName(e.target.value)}
                  size="small"
                />
                <TextField
                  fullWidth
                  required
                  label="นามสกุล (Last Name)"
                  value={sLastName}
                  onChange={(e) => setSLastName(e.target.value)}
                  size="small"
                />
              </Box>

              <TextField
                fullWidth
                disabled
                label="อีเมลบัญชีผู้ใช้ (Email)"
                value={objUser?.sEmail || ''}
                size="small"
                helperText="อีเมลเป็นบัญชีหลักในระบบ ไม่สามารถแก้ไขได้"
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth size="small" required sx={{ mb: 2.5 }}>
                <InputLabel id="profile-dept-label">สังกัดแผนก</InputLabel>
                <Select
                  labelId="profile-dept-label"
                  label="สังกัดแผนก"
                  value={nDepartmentId || ''}
                  onChange={(e) => setNDepartmentId(Number(e.target.value))}
                >
                  {lstDepartments.map((dept) => (
                    <MenuItem key={dept.nDepartmentId} value={dept.nDepartmentId}>
                      {dept.sDepartmentName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                disabled={isSavingProfile}
                startIcon={isSavingProfile ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                sx={{
                  bgcolor: '#2563eb',
                  '&:hover': { bgcolor: '#1d4ed8' },
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                }}
              >
                {isSavingProfile ? 'กำลังบันทึก...' : 'บันทึกข้อมูลส่วนตัว'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* ฟอร์มเปลี่ยนรหัสผ่าน */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            border: '1px solid #e2e8f0',
            height: '100%',
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
              <LockIcon sx={{ color: '#174785' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#174785' }}>
                เปลี่ยนรหัสผ่าน
              </Typography>
            </Box>
            <Divider sx={{ mb: 2.5 }} />

            {sPasswordSuccess && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                {sPasswordSuccess}
              </Alert>
            )}
            {sPasswordError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {sPasswordError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleChangePassword} noValidate>
              <TextField
                fullWidth
                required
                type={isShowOldPass ? 'text' : 'password'}
                label="รหัสผ่านปัจจุบัน"
                value={sCurrentPassword}
                onChange={(e) => setSCurrentPassword(e.target.value)}
                size="small"
                sx={{ mb: 2 }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setIsShowOldPass(!isShowOldPass)} edge="end">
                          {isShowOldPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                fullWidth
                required
                type={isShowNewPass ? 'text' : 'password'}
                label="รหัสผ่านใหม่"
                value={sNewPassword}
                onChange={(e) => setSNewPassword(e.target.value)}
                size="small"
                helperText="ขั้นต่ำ 6 ตัวอักษร"
                sx={{ mb: 2 }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setIsShowNewPass(!isShowNewPass)} edge="end">
                          {isShowNewPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                fullWidth
                required
                type={isShowNewPass ? 'text' : 'password'}
                label="ยืนยันรหัสผ่านใหม่"
                value={sConfirmNewPassword}
                onChange={(e) => setSConfirmNewPassword(e.target.value)}
                size="small"
                sx={{ mb: 2.5 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="outlined"
                disabled={isChangingPassword}
                startIcon={isChangingPassword ? <CircularProgress size={18} color="inherit" /> : <LockIcon />}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  fontWeight: 600,
                  borderColor: '#2563eb',
                  color: '#2563eb',
                  '&:hover': { borderColor: '#1d4ed8', bgcolor: 'rgba(37,99,235,0.04)' },
                }}
              >
                {isChangingPassword ? 'กำลังดำเนินการ...' : 'อัปเดตรหัสผ่าน'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
