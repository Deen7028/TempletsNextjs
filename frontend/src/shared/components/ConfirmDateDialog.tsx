'use client';
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    TextField,
    Box
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface IConfirmDateDialogProps {
    isOpen: boolean;
    sTitle: string;
    sMessage: string;
    dDefaultDate: string; // 'YYYY-MM-DD' formatted string
    sConfirmText?: string;
    sCancelText?: string;
    onConfirm: (dDate: string) => void;
    onClose: () => void;
}

export const ConfirmDateDialog = ({
    isOpen,
    sTitle,
    sMessage,
    dDefaultDate,
    sConfirmText = 'ยืนยัน',
    sCancelText = 'ยกเลิก',
    onConfirm,
    onClose
}: IConfirmDateDialogProps) => {
    const [dSelectedDate, setDSelectedDate] = useState<string>('');
    const [dPrevDefaultDate, setDPrevDefaultDate] = useState<string>('');
    const [isPrevOpen, setIsPrevOpen] = useState<boolean>(false);

    // ปรับเปลี่ยนค่า state ระหว่างการ Render แทนการใช้ useEffect เพื่อหลีกเลี่ยง Cascading Renders
    if (isOpen !== isPrevOpen || dDefaultDate !== dPrevDefaultDate) {
        setIsPrevOpen(isOpen);
        setDPrevDefaultDate(dDefaultDate);
        setDSelectedDate(dDefaultDate || new Date().toISOString().split('T')[0]);
    }

    const handleConfirmClick = () => {
        onConfirm(dSelectedDate);
        onClose();
    };

    return (
        <Dialog 
            open={isOpen} 
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                        bgcolor: '#1c2233',
                        backgroundImage: 'none',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }
                }
            }}
        > 
            {/* Title */}
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 3 }}>
                <CalendarMonthIcon sx={{ color: '#3d9eff' }} />
                <Typography variant="h6" component="span" sx={{ fontFamily: 'Syne', fontWeight: 700, color: '#fff' }}>
                    {sTitle}
                </Typography>
            </DialogTitle>
            
            {/* Content */}
            <DialogContent>
                <DialogContentText sx={{ color: '#7a8499', fontSize: '0.95rem', mb: 3 }}>
                    {sMessage}
                </DialogContentText>
                
                <Box sx={{ mt: 1 }}>
                    <TextField
                        label="วันที่ชำระเงิน/รับเงินจริง"
                        type="date"
                        variant="outlined"
                        fullWidth
                        value={dSelectedDate}
                        onChange={(objEvent: React.ChangeEvent<HTMLInputElement>) => {
                            setDSelectedDate(objEvent.target.value);
                        }}
                        slotProps={{ inputLabel: { shrink: true } }}
                        sx={{
                            '& input::-webkit-calendar-picker-indicator': {
                                filter: 'invert(1)',
                                cursor: 'pointer'
                            },
                            '& .MuiOutlinedInput-root': {
                                color: '#fff',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)'
                                },
                                '&:hover fieldset': {
                                    borderColor: '#3d9eff'
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#3d9eff'
                                }
                            },
                            '& .MuiInputLabel-root': {
                                color: '#7a8499',
                                '&.Mui-focused': {
                                    color: '#3d9eff'
                                }
                            }
                        }}
                    />
                </Box>
            </DialogContent>

            {/* Actions */}
            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button 
                    onClick={onClose} 
                    sx={{ 
                        color: '#7a8499',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' }
                    }}
                >
                    {sCancelText}
                </Button>
                <Button 
                    onClick={handleConfirmClick} 
                    variant="contained"
                    disabled={!dSelectedDate}
                    sx={{ 
                        bgcolor: '#3d9eff',
                        color: '#fff',
                        fontWeight: 600,
                        px: 3,
                        '&:hover': { 
                            bgcolor: '#348ce6' 
                        }
                    }}
                >
                    {sConfirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
