'use client';

import React, { Component, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ErrorOutlined as ErrorOutlineIcon, Refresh as RefreshIcon } from '@mui/icons-material';

interface IErrorBoundaryProps {
    children: ReactNode;
    // Custom fallback UI (optional)
    objFallback?: ReactNode;
}

interface IErrorBoundaryState {
    isError: boolean;
    sErrorMsg: string;
}

/**
 * ErrorBoundary — ดักจับ JavaScript errors ใน component tree
 * ป้องกันหน้าขาวเมื่อมี uncaught error และแสดง fallback UI พร้อมปุ่ม Retry
 */
export class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
    constructor(props: IErrorBoundaryProps) {
        super(props);
        this.state = { isError: false, sErrorMsg: '' };
    }

    static getDerivedStateFromError(objError: Error): IErrorBoundaryState {
        return { isError: true, sErrorMsg: objError.message };
    }

    componentDidCatch(objError: Error, objInfo: React.ErrorInfo): void {
        // จุดขยาย: ส่ง error ไปยัง monitoring service (Sentry, Datadog, etc.)
        console.error('[ErrorBoundary] Uncaught error:', objError, objInfo.componentStack);
    }

    handleReset = (): void => {
        this.setState({ isError: false, sErrorMsg: '' });
    };

    render(): ReactNode {
        if (this.state.isError) {
            // แสดง custom fallback ถ้ามี
            if (this.props.objFallback) return this.props.objFallback;

            return (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 300,
                        gap: 2,
                        p: 4,
                        border: '1px solid',
                        borderColor: 'error.main',
                        borderRadius: 3,
                        bgcolor: 'background.paper',
                        opacity: 0.95,
                    }}
                >
                    <ErrorOutlineIcon sx={{ fontSize: 48, color: 'error.main' }} />
                    <Typography
                        variant="h6"
                        sx={{ color: 'text.primary', fontWeight: 700, textAlign: 'center' }}
                    >
                        เกิดข้อผิดพลาดที่ไม่คาดคิด
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            textAlign: 'center',
                            maxWidth: 400,
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                        }}
                    >
                        {this.state.sErrorMsg || 'An unexpected error occurred.'}
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={this.handleReset}
                        color="error"
                        size="small"
                        sx={{ mt: 1, borderRadius: 2 }}
                    >
                        ลองใหม่อีกครั้ง
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}
