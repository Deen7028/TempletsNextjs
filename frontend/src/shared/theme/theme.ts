import { createTheme } from '@mui/material/styles';

/**
 * 🎨 BRAND_COLORS: ปรับแต่งสีระบบทั้งหมดที่จุดเดียว (Single Source of Truth)
 * เปลี่ยนรหัสสีที่นี่ จะเปลี่ยนทั้ง MUI Theme, Navbar, Cards, Buttons และ CSS Variables ทันที
 */
export const BRAND_COLORS = {
  // Brand Colors
  primary: '#2563eb',       // สีปุ่มและ Action หลัก (Royal Blue)
  primaryDark: '#174785',   // สี Navbar / Top Header บาร์ด้านบน (Deep Navy)
  primaryLight: '#60a5fa',  // สี Hover / Accent
  primaryHover: '#1d4ed8',  // สี Hover ของปุ่ม Primary

  // Secondary
  secondary: '#174785',
  secondaryLight: '#e3f2fd',

  // Status & Feedback
  success: '#16a34a',       // สีเขียว (สำเร็จ/อนุมัติ)
  successHover: '#15803d',
  successLight: '#dcfce7',
  warning: '#f59e0b',       // สีส้ม (แจ้งเตือน/รอตรวจสอบ)
  warningLight: '#fef3c7',
  danger: '#ef4444',        // สีแดง (ข้อผิดพลาด/ลบ/ไม่อนุมัติ)
  dangerLight: '#fee2e2',
  info: '#0288d1',
  infoLight: '#e1f5fe',

  // Light Mode Backgrounds & Neutrals
  backgroundLight: '#f0f4f9', // พื้นหลังหลักของหน้าเว็บ (Light Mode)
  surfaceLight: '#ffffff',    // พื้นหลัง Card / Dialog / Table
  borderLight: '#e2e8f0',     // สีขอบ Card และ Input
  textLight: '#1e293b',       // สีข้อความหลัก
  textSecondaryLight: '#64748b',

  // Dark Mode Backgrounds & Neutrals
  backgroundDark: '#0f172a',  // พื้นหลังหลักของหน้าเว็บ (Dark Mode)
  surfaceDark: '#1e293b',     // พื้นหลัง Card / Dialog
  borderDark: '#334155',      // สีขอบ (Dark Mode)
  textDark: '#f8fafc',        // สีข้อความหลัก (Dark Mode)
  textSecondaryDark: '#94a3b8',
};

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
  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: isDark ? BRAND_COLORS.backgroundDark : BRAND_COLORS.backgroundLight,
          color: isDark ? BRAND_COLORS.textDark : BRAND_COLORS.textLight,
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
          backgroundColor: BRAND_COLORS.primary,
          '&:hover': {
            backgroundColor: BRAND_COLORS.primaryHover,
          },
        },
        containedSuccess: {
          backgroundColor: BRAND_COLORS.success,
          '&:hover': {
            backgroundColor: BRAND_COLORS.successHover,
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
          border: `1px solid ${isDark ? BRAND_COLORS.borderDark : BRAND_COLORS.borderLight}`,
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
          backgroundColor: isDark ? BRAND_COLORS.surfaceDark : BRAND_COLORS.surfaceLight,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#94a3b8',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: BRAND_COLORS.primary,
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
          borderColor: isDark ? BRAND_COLORS.borderDark : BRAND_COLORS.borderLight,
        },
        head: {
          fontWeight: 600,
          backgroundColor: isDark ? BRAND_COLORS.surfaceDark : '#f8fafc',
          color: isDark ? BRAND_COLORS.textSecondaryDark : '#475569',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: BRAND_COLORS.primaryDark,
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
      default: BRAND_COLORS.backgroundLight,
      paper: BRAND_COLORS.surfaceLight,
    },
    primary: {
      main: BRAND_COLORS.primary,
      dark: BRAND_COLORS.primaryDark,
      light: BRAND_COLORS.primaryLight,
      contrastText: '#ffffff',
    },
    secondary: {
      main: BRAND_COLORS.secondary,
      contrastText: '#ffffff',
    },
    success: {
      main: BRAND_COLORS.success,
      light: BRAND_COLORS.successLight,
      contrastText: '#ffffff',
    },
    warning: {
      main: BRAND_COLORS.warning,
      light: BRAND_COLORS.warningLight,
      contrastText: '#ffffff',
    },
    error: {
      main: BRAND_COLORS.danger,
      light: BRAND_COLORS.dangerLight,
      contrastText: '#ffffff',
    },
    text: {
      primary: BRAND_COLORS.textLight,
      secondary: BRAND_COLORS.textSecondaryLight,
    },
    divider: BRAND_COLORS.borderLight,
  },
  typography: objCommonTypography,
  shape: { borderRadius: 8 },
  components: getCommonComponents(false),
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: BRAND_COLORS.backgroundDark,
      paper: BRAND_COLORS.surfaceDark,
    },
    primary: {
      main: BRAND_COLORS.primaryLight,
      dark: BRAND_COLORS.primaryDark,
      light: BRAND_COLORS.primaryLight,
      contrastText: '#ffffff',
    },
    secondary: {
      main: BRAND_COLORS.secondary,
      contrastText: '#ffffff',
    },
    success: {
      main: BRAND_COLORS.success,
      light: 'rgba(34, 197, 94, 0.15)',
      contrastText: '#ffffff',
    },
    warning: {
      main: BRAND_COLORS.warning,
      light: 'rgba(245, 158, 11, 0.15)',
      contrastText: '#ffffff',
    },
    error: {
      main: BRAND_COLORS.danger,
      light: 'rgba(239, 68, 68, 0.15)',
      contrastText: '#ffffff',
    },
    text: {
      primary: BRAND_COLORS.textDark,
      secondary: BRAND_COLORS.textSecondaryDark,
    },
    divider: BRAND_COLORS.borderDark,
  },
  typography: objCommonTypography,
  shape: { borderRadius: 8 },
  components: getCommonComponents(true),
});

export const getTheme = (mode: 'light' | 'dark') => (mode === 'dark' ? darkTheme : lightTheme);