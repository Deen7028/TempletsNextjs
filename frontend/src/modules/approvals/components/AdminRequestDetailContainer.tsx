'use client';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { exportPurchaseOrderToExcel } from '../utils/exportPoExcel';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CancelIcon from '@mui/icons-material/Cancel';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IPurchaseRequest } from '../interfaces/IApproval';
import { approvalService } from '../services/approvalService';
import { useAuth } from '@/modules/auth';
import dayjs from 'dayjs';

interface IAdminRequestDetailProps {
  nRequestId: number;
}

export const AdminRequestDetailContainer: React.FC<IAdminRequestDetailProps> = ({ nRequestId }) => {
  const objRouter = useRouter();
  const { objUser } = useAuth();

  const [objPR, setObjPR] = useState<IPurchaseRequest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [sError, setSError] = useState<string>('');

  // Dialog State สำหรับ Action (อนุมัติ, ส่งกลับแก้ไข, ไม่อนุมัติ)
  const [actionType, setActionType] = useState<'APPROVE' | 'REVISION' | 'REJECT' | null>(null);
  const [sRemarks, setSRemarks] = useState<string>('');

  // โหลดข้อมูลคำขอสั่งซื้อ
  useEffect(() => {
    setIsLoading(true);
    approvalService.getPurchaseRequestById(nRequestId).then((data) => {
      setObjPR(data);
      setIsLoading(false);
    });
  }, [nRequestId]);

  const handleOpenActionModal = (type: 'APPROVE' | 'REVISION' | 'REJECT') => {
    setActionType(type);
    setSRemarks('');
    setSError('');
  };

  const handleCloseActionModal = () => {
    setActionType(null);
    setSRemarks('');
  };

  // ยืนยันการส่งผลการตรวจสอบ
  const handleConfirmAction = async () => {
    if (!actionType || !objPR) return;

    if (actionType !== 'APPROVE' && !sRemarks.trim()) {
      setSError('กรุณาระบุเหตุผลหรือข้อความแจ้งกลับ');
      return;
    }

    setIsProcessing(true);
    setSError('');

    try {
      const res = await approvalService.reviewPurchaseRequest(objPR.nRequestId || nRequestId, {
        sAction: actionType,
        nActionByEmployeeId: objUser?.nEmployeeId || 1,
        sRemarks: sRemarks.trim(),
      });

      handleCloseActionModal();

      if (actionType === 'APPROVE') {
        const poNumber = res?.data?.sPoNumber || 'PO-' + dayjs().format('YYYYMMDD') + '-001';
        objRouter.push(`/admin/requests/${objPR.nRequestId || nRequestId}/result?poNumber=${encodeURIComponent(poNumber)}`);
      } else {
        const updated = await approvalService.getPurchaseRequestById(nRequestId);
        setObjPR(updated);
      }
    } catch (err: any) {
      setSError(err?.message || 'เกิดข้อผิดพลาดในการประมวลผลคำขอ');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dtStr?: string) => {
    if (!dtStr) return '-';
    try {
      const d = dayjs(dtStr);
      const yearBuddha = (d.year() + 543) % 100;
      return `${d.format('DD/MM')}/${String(yearBuddha).padStart(2, '0')} เวลา ${d.format('HH:mm')} น.`;
    } catch {
      return dtStr;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!objPR) {
    return (
      <Box sx={{ mx: 'auto', p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          ไม่พบข้อมูลคำขอสั่งซื้อ
        </Typography>
        <Button component={Link} href="/admin/requests" sx={{ mt: 2 }}>
          กลับหน้ารายการ
        </Button>
      </Box>
    );
  }

  const isPending = objPR.sStatus === 'PENDING_APPROVAL';

  const handleExportExcel = () => {
    if (!objPR || !objPR.sGeneratedPoNumber) return;

    exportPurchaseOrderToExcel({
      nRequestId: objPR.nRequestId || nRequestId,
      sPoNumber: objPR.sGeneratedPoNumber,
      nSupplierId: 1,
      nLocationId: 1,
      dtPoDate: dayjs(objPR.dtUpdatedAt || objPR.dtCreatedAt).format('DD/MM/YYYY'),
      dtDeliveryDate: dayjs().add(3, 'day').format('DD/MM/YYYY'),
      sSupplierName: 'บริษัท ซีพี แอ็กซ์ตร้า จำกัด (มหาชน)',
      sDepartmentName: objPR.sDepartmentName || objPR.sDepartmentCode || 'F&B ALACART',
      sPaymentTerm: '-',
      sPaymentMethod: 'Cr.',
      sRequiredTime: '08:00 - 11:30 น.',
      lstItems: (objPR.lstItems || []).map((item, idx) => ({
        nItemSeq: idx + 1,
        sProductCode: item.sProductCode || `P${String(item.nProductId).padStart(4, '0')}`,
        sProductName: item.sSnapshotProductName,
        nQuantity: item.nQuantity,
        sUnit: item.sSnapshotUnit,
        dUnitPrice: item.dUnitPrice,
        dLineTotal: item.dLineTotal,
        sRemarks: item.sRemarks || '',
      })),
    });
  };

  const isApprovedWithPo = (objPR.sStatus === 'APPROVED' || Boolean(objPR.sGeneratedPoNumber)) && Boolean(objPR.sGeneratedPoNumber);

  return (
    <Box sx={{ px: { xs: 1.5, sm: 2.5 }, py: { xs: 1.5, sm: 2.5 }, width: '100%' }}>
      {/* ส่วนปุ่มย้อนกลับและชื่อหน้า */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            component={Link}  
            href="/admin/requests"
            startIcon={<ArrowBackIcon />}
            sx={{
              color: '#475569',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': { bgcolor: '#f1f5f9' },
            }}
          >
            กลับ
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#174785', fontSize: { xs: '1.25rem', sm: '1.45rem' } }}>
            รายละเอียดคำขอ (Admin)
          </Typography>
        </Box>

        {isApprovedWithPo && (
          <Button
            variant="contained"
            color="success"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportExcel}
            sx={{
              bgcolor: '#059669',
              '&:hover': { bgcolor: '#047857' },
              fontWeight: 600,
              borderRadius: 2.5,
              textTransform: 'none',
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
              px: 2,
            }}
          >
            ดาวน์โหลด Excel (PO)
          </Button>
        )}
      </Box>

      {/* บัตรรายละเอียดคำขอ */}
      <Card
        sx={{
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          mb: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#174785', mb: 1.5 }}>
            รายละเอียดคำขอ
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              rowGap: 1.2,
              columnGap: 2,
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90 }}>
                วันที่สั่ง :
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {formatDate(objPR.dtCreatedAt)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90 }}>
                แผนก :
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {objPR.sDepartmentCode || objPR.sDepartmentName || '-'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90 }}>
                ผู้สั่ง :
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {objPR.sRequestedByName || `พนักงาน #${objPR.nRequestedByEmployeeId}`}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90 }}>
                จำนวนรายการ :
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#2563eb' }}>
                {objPR.lstItems ? objPR.lstItems.length : 0} รายการ
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90 }}>
                สถานะปัจจุบัน :
              </Typography>
              <Chip
                label={
                  objPR.sStatus === 'PENDING_APPROVAL'
                    ? 'รอตรวจสอบ'
                    : objPR.sStatus === 'APPROVED'
                    ? 'อนุมัติแล้ว'
                    : objPR.sStatus === 'REVISION'
                    ? 'ส่งกลับแก้ไข'
                    : 'ไม่อนุมัติ'
                }
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  bgcolor:
                    objPR.sStatus === 'PENDING_APPROVAL'
                      ? '#fff7ed'
                      : objPR.sStatus === 'APPROVED'
                      ? '#ecfdf5'
                      : objPR.sStatus === 'REVISION'
                      ? '#fefce8'
                      : '#fef2f2',
                  color:
                    objPR.sStatus === 'PENDING_APPROVAL'
                      ? '#ea580c'
                      : objPR.sStatus === 'APPROVED'
                      ? '#059669'
                      : objPR.sStatus === 'REVISION'
                      ? '#ca8a04'
                      : '#dc2626',
                }}
              />
            </Box>

            {objPR.sGeneratedPoNumber && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90 }}>
                  เลขที่ใบ PO :
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#059669' }}>
                  {objPR.sGeneratedPoNumber}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  startIcon={<FileDownloadIcon sx={{ fontSize: '1.1rem !important' }} />}
                  onClick={handleExportExcel}
                  sx={{
                    ml: { xs: 0, sm: 1 },
                    py: 0.2,
                    px: 1,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    borderColor: '#a7f3d0',
                    color: '#047857',
                    bgcolor: '#ecfdf5',
                    '&:hover': {
                      bgcolor: '#d1fae5',
                      borderColor: '#6ee7b7',
                    },
                  }}
                >
                  โหลด Excel
                </Button>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* ตารางรายการสินค้า */}
      {/* ตารางรายการสินค้า */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#174785', mb: 1.5 }}>
          รายการสินค้า
        </Typography>

        {/* Desktop & Tablet Table */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
            }}
          >
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.5, width: 110 }}>รหัสสินค้า</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.5 }}>รายการสินค้า</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.5, textAlign: 'center', width: 80 }}>
                    จำนวน
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.5, textAlign: 'center', width: 80 }}>
                    หน่วย
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.5, textAlign: 'right', width: 110 }}>
                    ราคา/หน่วย
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.5, textAlign: 'right', width: 120 }}>
                    รวมเงิน
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {objPR.lstItems?.map((item, index) => {
                  const unitPrice = Number(item.dUnitPrice || 0);
                  const lineTotal = Number(item.dLineTotal || (unitPrice * item.nQuantity));
                  return (
                    <TableRow key={item.nRequestItemId || index} hover>
                      <TableCell sx={{ py: 1.8 }}>
                        <Chip
                          label={item.sProductCode || (item.nProductId ? `90142${item.nProductId}` : '-')}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            bgcolor: '#f1f5f9',
                            color: '#1e293b',
                            borderRadius: 1.5,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1.8, fontWeight: 600, color: '#1e293b' }}>
                        {item.sSnapshotProductName}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.8, fontWeight: 700, color: '#1e293b' }}>
                        {item.nQuantity}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.8 }}>
                        <Chip
                          label={item.sSnapshotUnit}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            bgcolor: '#ecfdf5',
                            color: '#047857',
                            borderRadius: 1.5,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1.8, fontWeight: 600, color: '#475569' }}>
                        ฿{unitPrice.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1.8, fontWeight: 700, color: '#0f766e' }}>
                        ฿{lineTotal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  );
                })}

                {/* แถวสรุปยอดเงินรวมทั้งหมด */}
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell colSpan={4} align="right" sx={{ py: 1.8, fontWeight: 700, color: '#334155' }}>
                    ยอดรวมประมาณการทั้งสิ้น :
                  </TableCell>
                  <TableCell colSpan={2} align="right" sx={{ py: 1.8, fontWeight: 800, color: '#0f766e', fontSize: '1.05rem' }}>
                    ฿{Number(
                      objPR.dTotalAmount ?? 
                      objPR.lstItems?.reduce((acc, it) => acc + Number(it.dLineTotal || ((it.dUnitPrice || 0) * it.nQuantity)), 0) ?? 
                      0
                    ).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Mobile Cards for Items */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
          {objPR.lstItems?.map((item, index) => {
            const unitPrice = Number(item.dUnitPrice || 0);
            const lineTotal = Number(item.dLineTotal || (unitPrice * item.nQuantity));
            return (
              <Card
                key={item.nRequestItemId || index}
                elevation={0}
                sx={{
                  p: 1.8,
                  borderRadius: 2.5,
                  border: '1px solid #e2e8f0',
                  bgcolor: '#ffffff',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', flex: 1, mr: 1 }}>
                    {item.sSnapshotProductName}
                  </Typography>
                  <Chip
                    label={item.sProductCode || (item.nProductId ? `90142${item.nProductId}` : '-')}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      height: 22,
                      bgcolor: '#f1f5f9',
                      color: '#1e293b',
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.5, borderTop: '1px dashed #f1f5f9' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      จำนวน:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {item.nQuantity} {item.sSnapshotUnit}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                      (@฿{unitPrice.toLocaleString('th-TH', { minimumFractionDigits: 2 })})
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f766e' }}>
                    ฿{lineTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Card>
            );
          })}

          {/* Mobile Grand Total Summary Card */}
          <Card
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2.5,
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155' }}>
              ยอดรวมประมาณการทั้งสิ้น:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f766e', fontSize: '1.15rem' }}>
              ฿{Number(
                objPR.dTotalAmount ?? 
                objPR.lstItems?.reduce((acc, it) => acc + Number(it.dLineTotal || ((it.dUnitPrice || 0) * it.nQuantity)), 0) ?? 
                0
              ).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          </Card>
        </Box>
      </Box>

      {/* 3 ปุ่มคำสั่งหลัก (อนุมัติ, ส่งกลับแก้ไข, ไม่อนุมัติ) */}
      {isPending ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
            gap: 1.5,
            mt: 3,
          }}
        >
          {/* ปุ่มอนุมัติ (สีเขียว) */}
          <Button
            variant="contained"
            size="large"
            onClick={() => handleOpenActionModal('APPROVE')}
            startIcon={<CheckCircleIcon />}
            sx={{
              py: 1.3,
              fontWeight: 700,
              fontSize: '0.98rem',
              borderRadius: 2.5,
              bgcolor: '#16a34a',
              '&:hover': { bgcolor: '#15803d' },
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
              textTransform: 'none',
            }}
          >
            อนุมัติ
          </Button>

          {/* ปุ่มส่งกลับแก้ไข (สีส้ม) */}
          <Button
            variant="contained"
            size="large"
            onClick={() => handleOpenActionModal('REVISION')}
            startIcon={<EditNoteIcon />}
            sx={{
              py: 1.3,
              fontWeight: 700,
              fontSize: '0.98rem',
              borderRadius: 2.5,
              bgcolor: '#f59e0b',
              '&:hover': { bgcolor: '#d97706' },
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
              textTransform: 'none',
            }}
          >
            ส่งกลับแก้ไข
          </Button>

          {/* ปุ่มไม่อนุมัติ (สีแดง) */}
          <Button
            variant="contained"
            size="large"
            onClick={() => handleOpenActionModal('REJECT')}
            startIcon={<CancelIcon />}
            sx={{
              py: 1.3,
              fontWeight: 700,
              fontSize: '0.98rem',
              borderRadius: 2.5,
              bgcolor: '#dc2626',
              '&:hover': { bgcolor: '#b91c1c' },
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
              textTransform: 'none',
            }}
          >
            ไม่อนุมัติ
          </Button>
        </Box>
      ) : (
        <Alert severity="info" sx={{ borderRadius: 2.5 }}>
          คำขอนี้ได้รับการประมวลผลแล้ว (สถานะ:{' '}
          {objPR.sStatus === 'APPROVED' ? 'อนุมัติแล้ว' : objPR.sStatus === 'REVISION' ? 'ส่งกลับแก้ไข' : 'ไม่อนุมัติ'})
          {objPR.sAdminRemarks && ` - หมายเหตุ: ${objPR.sAdminRemarks}`}
        </Alert>
      )}

      {/* Modal ยืนยันการดำเนินการ */}
      <Dialog open={Boolean(actionType)} onClose={handleCloseActionModal} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700, color: '#1e293b' }}>
          {actionType === 'APPROVE' && 'ยืนยันการอนุมัติคำขอสั่งซื้อ'}
          {actionType === 'REVISION' && 'ส่งกลับเพื่อให้แก้ไขคำขอ'}
          {actionType === 'REJECT' && 'ยืนยันการไม่อนุมัติคำขอ'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {actionType === 'APPROVE'
              ? 'ระบบจะทำการเปลี่ยนสถานะเป็นอนุมัติ และสร้างใบสั่งซื้อ (PO) ส่งต่อไปยังฝ่ายจัดซื้อโดยอัตโนมัติ'
              : 'กรุณาระบุรายละเอียดหรือเหตุผลเพื่อแจ้งเตือนไปยังผู้สั่งซื้อ'}
          </Typography>

          {sError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {sError}
            </Alert>
          )}

          <TextField
            fullWidth
            multiline
            rows={3}
            label={actionType === 'APPROVE' ? 'หมายเหตุเพิ่มเติม (ถ้ามี)' : 'เหตุผล / ข้อความแจ้งแก้ไข *'}
            value={sRemarks}
            onChange={(e) => setSRemarks(e.target.value)}
            placeholder={
              actionType === 'APPROVE'
                ? 'ระบุข้อความเพิ่มเติม...'
                : actionType === 'REVISION'
                ? 'เช่น ปรับลดจำนวนสินค้า หรือเปลี่ยนเป็นยี่ห้อ...'
                : 'เช่น สินค้ายังคงมีสต็อกคงเหลือเพียงพอ...'
            }
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={handleCloseActionModal} disabled={isProcessing} sx={{ textTransform: 'none' }}>
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmAction}
            disabled={isProcessing}
            sx={{
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2,
              bgcolor:
                actionType === 'APPROVE'
                  ? '#16a34a'
                  : actionType === 'REVISION'
                  ? '#f59e0b'
                  : '#dc2626',
              '&:hover': {
                bgcolor:
                  actionType === 'APPROVE'
                    ? '#15803d'
                    : actionType === 'REVISION'
                    ? '#d97706'
                    : '#b91c1c',
              },
            }}
          >
            {isProcessing ? 'กำลังดำเนินการ...' : 'ยืนยัน'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
