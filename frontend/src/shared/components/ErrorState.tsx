'use client';
import React from 'react';
import { Typography, Button, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { ErrorOutlined as ErrorOutlineIcon } from '@mui/icons-material';

interface IErrorStateProps {
    sTitle?: string;
    sMessage?: string;
    sRetryText?: string;
    onRetry?: () => void;
}

export const ErrorState = ({
    sTitle = "เกิดข้อผิดพลาดในการโหลดข้อมูล",
    sMessage = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อของคุณและลองใหม่อีกครั้ง",
    sRetryText = "ลองใหม่อีกครั้ง",
    onRetry
}: IErrorStateProps) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 3, sm: 5 },
                border: '1px dashed',
                borderColor: 'error.light',
                borderRadius: 3,
                bgcolor: 'background.paper',
                backgroundImage: 'none',
                width: '100%',
                maxWidth: 600,
                mx: 'auto',
                my: 4,
                textAlign: 'center',
                boxShadow: 'none'
            }}
        >
            <Grid container  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Grid sx={{
                    display: 'inline-flex',
                    p: 1,
                    borderRadius: '50%',
                    bgcolor: 'rgba(244, 63, 94, 0.1)',
                    color: 'error.main',
                }}>
                    <ErrorOutlineIcon sx={{ fontSize: { xs: 40, sm: 40 } }} />
                </Grid>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 500,
                        color: 'text.primary',
                        fontFamily: 'Syne',
                        fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}
                >
                    {sTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto', lineHeight: 1.6 }}>
                    {sMessage}
                </Typography>
                {onRetry && (
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={onRetry}
                        sx={{
                            mt: 1,
                            textTransform: 'none',
                            px: 4,
                            py: 1,
                            borderRadius: 2,
                            fontWeight: 'bold',
                            border: '1.5px solid',
                            transition: 'all 0.2s',
                            '&:hover': {
                                border: '1.5px solid',
                                bgcolor: 'rgba(244, 63, 94, 0.05)',
                                transform: 'scale(1.02)'
                            }
                        }}
                    >
                        {sRetryText}
                    </Button>
                )}
            </Grid>
        </Paper>

    );
};
