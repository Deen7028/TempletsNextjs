'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  IconButton,
  Button,
} from '@mui/material';
import { LogoLoader, CustomPagination } from '@/shared/components';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IPurchaseRequest } from '../interfaces/IApproval';
import { approvalService } from '../services/approvalService';
import dayjs from 'dayjs';
type TabStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'ALL';


export const AdminRequestListContainer: React.FC = () => {
  const objRouter = useRouter();
  const [currentTab, setCurrentTab] = useState<TabStatus>('PENDING_APPROVAL');
  const [lstAllRequests, setLstAllRequests] = useState<IPurchaseRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [nPage, setNPage] = useState<number>(0);
  const [nRowsPerPage, setNRowsPerPage] = useState<number>(10);
  const [nTotalRequests, setNTotalRequests] = useState<number>(0);

  const loadRequests = async (status: string = currentTab, page: number = nPage, pageSize: number = nRowsPerPage) => {
    setIsLoading(true);
    try {
      const res = await approvalService.getPurchaseRequests(status, undefined, page + 1, pageSize);
      setLstAllRequests(res.data);
      setNTotalRequests(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests(currentTab, nPage, nRowsPerPage);
  }, [currentTab, nPage, nRowsPerPage]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: TabStatus) => {
    setCurrentTab(newValue);
    setNPage(0);
  };

  const lstFilteredRequests = lstAllRequests;

  const nPendingCount = lstAllRequests.filter((r) => r.sStatus === 'PENDING_APPROVAL').length;
  const nApprovedCount = lstAllRequests.filter((r) => r.sStatus === 'APPROVED').length;

  const getStatusChip = (sStatus: string) => {
    switch (sStatus) {
      case 'PENDING_APPROVAL':
        return (
          <Chip
            label="รอตรวจสอบ"
            size="small"
            sx={{
              bgcolor: '#fff7ed',
              color: '#ea580c',
              border: '1px solid #fed7aa',
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: 1.5,
              px: 0.5,
            }}
          />
        );
      case 'APPROVED':
        return (
          <Chip
            label="อนุมัติแล้ว"
            size="small"
            sx={{
              bgcolor: '#ecfdf5',
              color: '#059669',
              border: '1px solid #a7f3d0',
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: 1.5,
              px: 0.5,
            }}
          />
        );
      case 'REVISION':
        return (
          <Chip
            label="ส่งกลับแก้ไข"
            size="small"
            sx={{
              bgcolor: '#fefce8',
              color: '#ca8a04',
              border: '1px solid #fef08a',
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: 1.5,
              px: 0.5,
            }}
          />
        );
      case 'REJECTED':
        return (
          <Chip
            label="ไม่อนุมัติ"
            size="small"
            sx={{
              bgcolor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: 1.5,
              px: 0.5,
            }}
          />
        );
      default:
        return (
          <Chip
            label={sStatus}
            size="small"
            sx={{
              bgcolor: '#f1f5f9',
              color: '#475569',
              fontWeight: 600,
              fontSize: '0.75rem',
              borderRadius: 1.5,
            }}
          />
        );
    }
  };

  const formatDate = (dtStr?: string) => {
    if (!dtStr) return '-';
    try {
      const d = dayjs(dtStr);
      const yearBuddha = (d.year() + 543) % 100;
      return `${d.format('DD/MM')}/${String(yearBuddha).padStart(2, '0')}`;
    } catch {
      return dtStr;
    }
  };

  return (
    <Box sx={{ mx: 'auto', px: { xs: 1, sm: 2, md: 3 }, py: { xs: 1.5, sm: 2.5 }, width: '100%' }}>
      {/* ส่วนหัวหน้าจอ */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#174785', fontSize: { xs: '1.25rem', sm: '1.45rem' } }}>
           Admin : รายการที่รอตรวจสอบ
          </Typography>
          <Typography variant="body2" color="text.secondary">
            รายการขอสั่งซื้อสินค้า (PR) จากแผนกต่างๆ
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          onClick={() => loadRequests()}
          startIcon={<RefreshIcon />}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          รีเฟรชข้อมูล
        </Button>
      </Box>

      {/* แท็บสถานะ */}
      <Box sx={{ mb: 2.5 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            bgcolor: '#ffffff',
            borderRadius: 3,
            p: 0.6,
            border: '1px solid #e2e8f0',
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiTab-root': {
              minHeight: 44,
              borderRadius: 2.5,
              fontWeight: 700,
              fontSize: { xs: '0.82rem', sm: '0.92rem' },
              textTransform: 'none',
              color: '#64748b',
              transition: 'all 0.2s ease',
              '&.Mui-selected': {
                bgcolor: '#2563eb',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
              },
            },
          }}
        >
          <Tab
            value="PENDING_APPROVAL"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>รอตรวจสอบ</span>
                <Box
                  sx={{
                    bgcolor: currentTab === 'PENDING_APPROVAL' ? '#ffffff' : '#f1f5f9',
                    color: currentTab === 'PENDING_APPROVAL' ? '#2563eb' : '#475569',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  {nPendingCount}
                </Box>
              </Box>
            }
          />
          <Tab
            value="APPROVED"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>อนุมัติแล้ว</span>
                <Box
                  sx={{
                    bgcolor: currentTab === 'APPROVED' ? '#ffffff' : '#f1f5f9',
                    color: currentTab === 'APPROVED' ? '#2563eb' : '#475569',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  {nApprovedCount}
                </Box>
              </Box>
            }
          />
          <Tab value="ALL" label="ทั้งหมด" />
        </Tabs>
      </Box>

      {/* เนื้อหาตารางคำขอ */}
      {isLoading ? (
        <Box sx={{ py: 6 }}>
          <LogoLoader sMessage="กำลังโหลดรายการคำขอสั่งซื้อ..." />
        </Box>
      ) : lstFilteredRequests.length === 0 ? (
        <Card sx={{ borderRadius: 3, border: '1px dashed #cbd5e1', boxShadow: 'none', py: 6, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
            ไม่มีรายการคำขอในกลุ่มนี้
          </Typography>
        </Card>
      ) : (
        <>
          {/* Desktop & Tablet View */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              }}
            >
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 110 }}>วันที่</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, width: 130 }}>แผนก</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8 }}>ผู้สั่ง</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, textAlign: 'center', width: 130 }}>
                      จำนวนรายการ
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, textAlign: 'center', width: 130 }}>
                      สถานะ
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569', py: 1.8, textAlign: 'center', width: 80 }}>
                      จัดการ
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lstFilteredRequests.map((req) => (
                    <TableRow
                      key={req.nRequestId}
                      hover
                      onClick={() => objRouter.push(`/admin/requests/${req.nRequestId}`)}
                      sx={{
                        cursor: 'pointer',
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell sx={{ py: 2, fontWeight: 500, color: '#334155' }}>
                        {formatDate(req.dtCreatedAt)}
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          label={req.sDepartmentCode || req.sDepartmentName || '-'}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.76rem',
                            bgcolor: '#f1f5f9',
                            color: '#1e293b',
                            borderRadius: 1.5,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2, fontWeight: 600, color: '#1e293b' }}>
                        {req.sRequestedByName || `พนักงาน #${req.nRequestedByEmployeeId}`}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2, fontWeight: 700, color: '#2563eb' }}>
                        {req.nItemCount || (req.lstItems ? req.lstItems.length : '-')}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2 }}>
                        {getStatusChip(req.sStatus)}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2 }}>
                        <IconButton size="small" sx={{ color: '#2563eb', bgcolor: '#eff6ff' }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Mobile View */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 1.5 }}>
            {lstFilteredRequests.map((req) => (
              <Card
                key={req.nRequestId}
                component={Link}
                href={`/admin/requests/${req.nRequestId}`}
                sx={{
                  borderRadius: 2.5,
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: '#93c5fd',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.08)',
                  },
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                      วันที่: {formatDate(req.dtCreatedAt)}
                    </Typography>
                    {getStatusChip(req.sStatus)}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Chip
                          label={req.sDepartmentCode || req.sDepartmentName || '-'}
                          size="small"
                          sx={{ fontWeight: 700, fontSize: '0.72rem', height: 22, bgcolor: '#f1f5f9' }}
                        />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                          {req.sRequestedByName || `พนักงาน #${req.nRequestedByEmployeeId}`}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
                          จำนวน: <b>{req.nItemCount || (req.lstItems ? req.lstItems.length : '-')}</b> รายการ
                        </Typography>
                      </Box>
                    </Box>

                    <ArrowForwardIosIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box sx={{ mt: 2, borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <CustomPagination
              nPage={nPage}
              nRowsPerPage={nRowsPerPage}
              nTotal={nTotalRequests}
              onPageChange={(newPage) => setNPage(newPage)}
              onRowsPerPageChange={(newSize) => setNRowsPerPage(newSize)}
            />
          </Box>
        </>
      )}
    </Box>
  );
};
