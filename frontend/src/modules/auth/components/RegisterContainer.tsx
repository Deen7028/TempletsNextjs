'use client';

import React, { useState, useEffect } from 'react';
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
  IconButton,
  InputAdornment,
  Link as MuiLink,
  CircularProgress,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { IDepartment, IRegisterRequest, UserRole } from '../interfaces/IAuth';

export const RegisterContainer: React.FC = () => {
  const objRouter = useRouter();
  const [lstDepartments, setLstDepartments] = useState<IDepartment[]>([]);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sAlertError, setSAlertError] = useState<string>('');
  const [sAlertSuccess, setSAlertSuccess] = useState<string>('');

  const [objForm, setObjForm] = useState<IRegisterRequest>({
    sFirstName: '',
    sLastName: '',
    sEmail: '',
    sPassword: '',
    sConfirmPassword: '',
    nDepartmentId: 0,
    sRole: 'Employee',
  });

  const [objErrors, setObjErrors] = useState<{
    sFirstName?: string;
    sLastName?: string;
    sEmail?: string;
    sPassword?: string;
    sConfirmPassword?: string;
    nDepartmentId?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: typeof objErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!objForm.sFirstName.trim()) {
      errors.sFirstName = 'กรุณาระบุชื่อจริง';
    } else if (objForm.sFirstName.trim().length < 2) {
      errors.sFirstName = 'ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร';
    }

    if (!objForm.sLastName.trim()) {
      errors.sLastName = 'กรุณาระบุนามสกุล';
    } else if (objForm.sLastName.trim().length < 2) {
      errors.sLastName = 'นามสกุลต้องมีความยาวอย่างน้อย 2 ตัวอักษร';
    }

    if (!objForm.sEmail.trim()) {
      errors.sEmail = 'กรุณากรอกอีเมล';
    } else if (!emailRegex.test(objForm.sEmail.trim())) {
      errors.sEmail = 'รูปแบบอีเมลไม่ถูกต้อง (เช่น user@railayresort.com)';
    }

    if (!objForm.sPassword) {
      errors.sPassword = 'กรุณากรอกรหัสผ่าน';
    } else if (objForm.sPassword.length < 6) {
      errors.sPassword = 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
    }

    if (!objForm.sConfirmPassword) {
      errors.sConfirmPassword = 'กรุณายืนยันรหัสผ่าน';
    } else if (objForm.sPassword !== objForm.sConfirmPassword) {
      errors.sConfirmPassword = 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน';
    }

    if (!objForm.nDepartmentId || objForm.nDepartmentId <= 0) {
      errors.nDepartmentId = 'กรุณาเลือกสังกัดแผนก';
    }

    setObjErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    authService.getDepartments().then((data) => {
      setLstDepartments(data);
      if (data.length > 0) {
        setObjForm((prev) => ({ ...prev, nDepartmentId: data[0].nDepartmentId }));
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setObjForm((prev) => ({ ...prev, [name]: value }));
    if (objErrors[name as keyof typeof objErrors]) {
      setObjErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDepartmentChange = (e: any) => {
    setObjForm((prev) => ({ ...prev, nDepartmentId: Number(e.target.value) }));
    if (objErrors.nDepartmentId) {
      setObjErrors((prev) => ({ ...prev, nDepartmentId: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSAlertError('');
    setSAlertSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.register({
        ...objForm,
        sFirstName: objForm.sFirstName.trim(),
        sLastName: objForm.sLastName.trim(),
        sEmail: objForm.sEmail.trim(),
      });
      if (res.status === 'success' || res.status === '200') {
        setSAlertSuccess('ลงทะเบียนสำเร็จ! กำลังนำท่านไปยังหน้าเข้าสู่ระบบ...');
        setTimeout(() => {
          objRouter.push('/login');
        }, 1500);
      } else {
        setSAlertError(res.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
      }
    } catch (err: any) {
      setSAlertError(err?.message || 'ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 520,
        mx: 'auto',
      }}
    >
      <Card
        sx={{
          width: '100%',
          borderRadius: { xs: 2.5, sm: 3 },
          boxShadow: { xs: '0 2px 12px rgba(0,0,0,0.06)', sm: '0 4px 20px rgba(0,0,0,0.08)' },
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        {/* Header แถบสีน้ำเงินเข้มตาม Mockup */}
        <Box
          sx={{
            bgcolor: '#174785',
            color: '#ffffff',
            py: { xs: 2, sm: 2.5 },
            px: { xs: 2, sm: 3 },
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              p: 0.8,
              borderRadius: 1.5,
              display: 'flex',
            }}
          >
            <ShoppingCartIcon sx={{ color: '#ffffff', fontSize: { xs: 22, sm: 26 } }} />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: { xs: '0.95rem', sm: '1.05rem' } }}
            >
              ระบบสั่งของ (PO/PR)
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'rgba(255,255,255,0.85)', fontSize: { xs: '0.72rem', sm: '0.78rem' } }}
            >
              Railay Great View Resort
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: { xs: 2, sm: 3.5 } }}>
          <Box sx={{ mb: { xs: 2, sm: 2.5 }, textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#174785',
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
              }}
            >
              ลงทะเบียนพนักงานใหม่
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: '0.82rem', sm: '0.875rem' } }}>
              สร้างบัญชีเพื่อขอสั่งซื้อและติดตามเอกสาร PR
            </Typography>
          </Box>

          {sAlertError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: '0.85rem' }}>
              {sAlertError}
            </Alert>
          )}

          {sAlertSuccess && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2, fontSize: '0.85rem' }}>
              {sAlertSuccess}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* ชื่อ และ นามสกุล แยกช่อง */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: { xs: 2, sm: 1.5 },
                mb: 2,
              }}
            >
              <TextField
                fullWidth
                required
                label="ชื่อ (First Name)"
                name="sFirstName"
                placeholder="เช่น สมชาย"
                value={objForm.sFirstName}
                onChange={handleChange}
                error={!!objErrors.sFirstName}
                helperText={objErrors.sFirstName}
                size="small"
              />
              <TextField
                fullWidth
                required
                label="นามสกุล (Last Name)"
                name="sLastName"
                placeholder="เช่น ใจดี"
                value={objForm.sLastName}
                onChange={handleChange}
                error={!!objErrors.sLastName}
                helperText={objErrors.sLastName}
                size="small"
              />
            </Box>

            {/* อีเมล */}
            <TextField
              fullWidth
              required
              type="email"
              label="อีเมล (Email)"
              name="sEmail"
              placeholder="name@railayresort.com"
              value={objForm.sEmail}
              onChange={handleChange}
              error={!!objErrors.sEmail}
              helperText={objErrors.sEmail}
              size="small"
              sx={{ mb: 2 }}
            />

            {/* สังกัดแผนก (Role ถูกกำหนดอัตโนมัติเป็น Employee) */}
            <FormControl fullWidth size="small" required error={!!objErrors.nDepartmentId} sx={{ mb: 2 }}>
              <InputLabel id="dept-label">สังกัดแผนก</InputLabel>
              <Select
                labelId="dept-label"
                label="สังกัดแผนก"
                value={objForm.nDepartmentId || ''}
                onChange={handleDepartmentChange}
              >
                {lstDepartments.map((dept) => (
                  <MenuItem key={dept.nDepartmentId} value={dept.nDepartmentId}>
                    {dept.sDepartmentName}
                  </MenuItem>
                ))}
              </Select>
              {objErrors.nDepartmentId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.8, fontSize: '0.75rem' }}>
                  {objErrors.nDepartmentId}
                </Typography>
              )}
            </FormControl>

            {/* รหัสผ่าน & ยืนยันรหัสผ่าน */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: { xs: 2, sm: 1.5 },
                mb: 3,
              }}
            >
              <TextField
                fullWidth
                required
                type={isShowPassword ? 'text' : 'password'}
                label="รหัสผ่าน"
                name="sPassword"
                value={objForm.sPassword}
                onChange={handleChange}
                error={!!objErrors.sPassword}
                helperText={objErrors.sPassword || 'ขั้นต่ำ 6 ตัวอักษร'}
                size="small"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setIsShowPassword(!isShowPassword)}
                          edge="end"
                        >
                          {isShowPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                fullWidth
                required
                type={isShowPassword ? 'text' : 'password'}
                label="ยืนยันรหัสผ่าน"
                name="sConfirmPassword"
                value={objForm.sConfirmPassword}
                onChange={handleChange}
                error={!!objErrors.sConfirmPassword}
                helperText={objErrors.sConfirmPassword}
                size="small"
              />
            </Box>

            {/* ปุ่มลงทะเบียน */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PersonAddAlt1Icon />}
              sx={{
                py: { xs: 1.1, sm: 1.25 },
                fontWeight: 600,
                fontSize: { xs: '0.95rem', sm: '1rem' },
                borderRadius: 2,
                bgcolor: '#2563eb',
                '&:hover': { bgcolor: '#1d4ed8' },
              }}
            >
              {isLoading ? 'กำลังลงทะเบียน...' : 'ยืนยันลงทะเบียน'}
            </Button>

            {/* ลิงก์ไปหน้า Login */}
            <Box sx={{ mt: 2.5, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.82rem', sm: '0.875rem' } }}>
                มีบัญชีผู้ใช้งานอยู่แล้ว?{' '}
                <MuiLink
                  component={Link}
                  href="/login"
                  sx={{
                    fontWeight: 600,
                    color: '#2563eb',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  เข้าสู่ระบบ
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
