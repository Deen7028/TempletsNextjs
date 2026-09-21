'use client';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography
} from '@mui/material';
import { WarningAmber as WarningAmberIcon } from '@mui/icons-material';

// กำหนด props ของ ConfirmDialog
interface IConfirmDialogProps {
    isOpen: boolean;
    sTitle: string;
    sMessage: string;
    sConfirmText?: string;
    sCancelText?: string;
    onConfirm: () => void;
    onClose: () => void;
    isDanger?: boolean;
}

// แสดงหน้าต่างยืนยันการลบ
export const ConfirmDialog = ({
    isOpen,
    sTitle,
    sMessage,
    sConfirmText = 'Confirm',
    sCancelText = 'Cancel',
    onConfirm,
    onClose,
    isDanger = false
}: IConfirmDialogProps) => {
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
            {/* title */}
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 3 }}>
                <WarningAmberIcon sx={{ color: isDanger ? '#ff4d6d' : '#f5c542' }} />
                <Typography variant="h6" component="span" sx={{ fontFamily: 'Syne', fontWeight: 700, color: '#fff' }}>
                    {sTitle}
                </Typography>
            </DialogTitle>
            
            {/* content */}
            <DialogContent>
                <DialogContentText sx={{ color: '#7a8499', fontSize: '0.95rem' }}>
                    {sMessage}
                </DialogContentText>
            </DialogContent>

            {/* actions */}
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
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }} 
                    variant="contained"
                    sx={{ 
                        bgcolor: isDanger ? '#ff4d6d' : '#3d9eff',
                        color: '#fff',
                        fontWeight: 600,
                        px: 3,
                        '&:hover': { 
                            bgcolor: isDanger ? '#e63958' : '#348ce6' 
                        }
                    }}
                >
                    {sConfirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
