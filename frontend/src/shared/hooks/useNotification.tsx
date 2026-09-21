'use client'
import React, { useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

export type NotificationSeverity = 'success' | 'error' | 'info' | 'warning';

export const useNotification = () => {
    // state สำหรับเก็บข้อมูลการแจ้งเตือน
    const [notification, setNotification] = useState<{ open: boolean; message: string; severity: NotificationSeverity }>({
        open: false,
        message: '',
        severity: 'success'
    });

    // ฟังก์ชันสำหรับแสดงการแจ้งเตือน
    const notify = useCallback((message: string, severity: NotificationSeverity = 'success') => {
        setNotification({ open: true, message, severity });
    }, []);
    
    // ฟังก์ชันสำหรับปิดการแจ้งเตือน
    const handleClose = useCallback((event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotification(prev => ({ ...prev, open: false }));
    }, []);
    // แสดงการแจ้งเตือน
    const NotificationComponent = (
        <Snackbar
            open={notification.open}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{ zIndex: 9999 }}
        >
            <Alert onClose={handleClose} severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
                {notification.message}
            </Alert>
        </Snackbar>
    );

    return { notify, NotificationComponent };
};
