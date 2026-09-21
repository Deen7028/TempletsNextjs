'use client';
import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';

//  สร้าง Animation แบบ Pulse (ย่อ-ขยาย และ สว่าง-มืด)
const pulseAnimation = keyframes`
  0% { opacity: 0.5; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.5; transform: scale(0.95); }
`;

interface ILogoLoaderProps {
    sMessage?: string; // ข้อความใต้โลโก้
}

// แสดงโลโก้พร้อม animation
export const LogoLoader = ({ sMessage = "Loading..." }: ILogoLoaderProps) => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px', // กำหนดความสูงขั้นต่ำเพื่อไม่ให้หน้าจอกระตุก
            width: '100%',
            gap: 2
        }}>
            {/* ตัวโลโก้ที่มี Animation */}
            <Typography
                variant="h4"
                sx={{
                    color: 'primary.main',
                    fontWeight: 800,
                    fontFamily: 'Syne',
                    animation: `${pulseAnimation} 1.5s ease-in-out infinite`
                }}
            >
                Cash<Box component="span" sx={{ color: 'text.primary', fontStyle: 'italic' }}>Flow</Box>
            </Typography>

            {/* ข้อความ Loading เล็กๆ ด้านล่าง */}
            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 2, textTransform: 'uppercase' }}>
                {sMessage}
            </Typography>
        </Box>
    );
};