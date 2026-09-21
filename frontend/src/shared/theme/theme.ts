import { createTheme } from '@mui/material/styles';

const fontHeading = "'Prompt', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const fontBody = "'Prompt', 'Sarabun', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const objCommonTypography = {
  fontFamily: fontBody,
  h4: { fontFamily: fontHeading, fontWeight: 700 },
  h5: { fontFamily: fontHeading, fontWeight: 700 },
  h6: { fontFamily: fontHeading, fontWeight: 600 },
  subtitle1: { fontFamily: fontBody, fontWeight: 600 },
  subtitle2: { fontFamily: fontBody, fontWeight: 500 },
  body1: { fontFamily: fontBody, fontSize: '0.95rem' },
  body2: { fontFamily: fontBody, fontSize: '0.875rem' },
  caption: { fontFamily: fontBody, fontSize: '0.75rem' },
  button: { fontFamily: fontHeading, fontWeight: 600, textTransform: 'none' as const },
};

const getCommonComponents = (isDark: boolean) => {
  const primaryMain = '#1e5192'; // Deep Navy Blue จาก mockup
  const primaryLight = '#2d6ac0';

  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: isDark ? '#0f172a' : '#f0f4f9', // พื้นหลังสีฟ้าเทาอ่อนแบบใน UI Mockup
          color: isDark ? '#e2e8f0' : '#1e293b',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none' as const,
          fontWeight: 600,
          padding: '8px 16px',
        },
        containedPrimary: {
          backgroundColor: '#2563eb', // Royal Blue ชัดเจนแบบปุ่มในภาพ
          '&:hover': {
            backgroundColor: '#1d4ed8',
          },
        },
        containedSuccess: {
          backgroundColor: '#16a34a',
          '&:hover': {
            backgroundColor: '#15803d',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: isDark
            ? '0 1px 3px rgba(0, 0, 0, 0.4)'
            : '0 1px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.04)',
          border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#94a3b8',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2563eb',
            borderWidth: '2px',
          },
        },
        input: {
          padding: '10px 14px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: fontBody,
          padding: '10px 14px',
          borderColor: isDark ? '#334155' : '#e2e8f0',
        },
        head: {
          fontWeight: 600,
          backgroundColor: isDark ? '#1e293b' : '#f8fafc',
          color: isDark ? '#94a3b8' : '#475569',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#174785', // สีน้ำเงินกรมท่าเข้มแบบ Top Header บาร์ใน mockup
          color: '#ffffff',
        },
      },
    },
  };
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f0f4f9', // พื้นหลังโทนสว่างสีฟ้าอ่อนตาม mockup
      paper: '#ffffff',
    },
    primary: {
      main: '#2563eb', // ปุ่มและ Action หลักเป็นสีฟ้า Royal Blue (#2563eb / #174785)
      dark: '#174785',
      light: '#60a5fa',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#174785',
      contrastText: '#ffffff',
    },
    success: {
      main: '#16a34a', // สีเขียวอนุมัติ
      light: '#dcfce7',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b', // สีส้มส่งกลับแก้ไข
      light: '#fef3c7',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444', // สีแดงไม่อนุมัติ / ลบ
      light: '#fee2e2',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    divider: '#e2e8f0',
  },
  typography: objCommonTypography,
  shape: { borderRadius: 8 },
  components: getCommonComponents(false),
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    primary: {
      main: '#3b82f6',
      dark: '#1d4ed8',
      light: '#60a5fa',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1e3a8a',
      contrastText: '#ffffff',
    },
    success: {
      main: '#22c55e',
      light: 'rgba(34, 197, 94, 0.15)',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b',
      light: 'rgba(245, 158, 11, 0.15)',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444',
      light: 'rgba(239, 68, 68, 0.15)',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
    divider: '#334155',
  },
  typography: objCommonTypography,
  shape: { borderRadius: 8 },
  components: getCommonComponents(true),
});

export const getTheme = (mode: 'light' | 'dark') => (mode === 'dark' ? darkTheme : lightTheme);