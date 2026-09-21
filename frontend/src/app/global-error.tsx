'use client';

import React from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ThemeRegistry } from '@/layout';

interface IGlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: IGlobalErrorProps) {
    const sErrorMessage = error?.message || 'เกิดข้อผิดพลาดรุนแรงในระดับระบบ (Global Layout Error)';

    return (
        <html lang="th">
            <body>
                <ThemeRegistry>
                    <Container maxWidth="sm" sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        minHeight: '100vh',
                        px: 2
                    }}>
                        <Paper sx={{
                            p: { xs: 3, sm: 5 },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            borderRadius: 4,
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(8px)',
                            backgroundImage: 'none'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'error.light',
                                color: 'error.main',
                                borderRadius: '50%',
                                width: 64,
                                height: 64,
                                mb: 3
                            }}>
                                <ReportProblemIcon sx={{ fontSize: 36 }} />
                            </Box>

                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', fontFamily: 'Sarabun' }}>
                                เกิดข้อผิดพลาดร้ายแรงของระบบ
                            </Typography>

                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, px: 2, fontFamily: 'Sarabun' }}>
                                ขออภัยในความไม่สะดวก ระบบตรวจพบความผิดปกติที่โครงสร้างหลักของแอปพลิเคชัน
                            </Typography>

                            <Box sx={{ 
                                width: '100%', 
                                p: 2, 
                                mb: 4, 
                                bgcolor: 'background.default', 
                                borderRadius: 2, 
                                border: '1px solid',
                                borderColor: 'divider',
                                textAlign: 'left'
                            }}>
                                <Typography variant="caption" sx={{ display: 'block', color: 'error.main', fontWeight: 'bold', mb: 0.5, fontFamily: 'monospace' }}>
                                    ERROR_MESSAGE:
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.primary', wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                    {sErrorMessage}
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<RefreshIcon />}
                                onClick={reset}
                                sx={{ 
                                    borderRadius: 2, 
                                    px: 4, 
                                    py: 1, 
                                    fontFamily: 'Sarabun', 
                                    textTransform: 'none',
                                    boxShadow: 'none',
                                    '&:hover': { boxShadow: 'none' }
                                }}
                            >
                                รีโหลดระบบใหม่
                            </Button>
                        </Paper>
                    </Container>
                </ThemeRegistry>
            </body>
        </html>
    );
}
