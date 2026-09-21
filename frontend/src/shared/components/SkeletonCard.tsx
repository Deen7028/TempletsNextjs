'use client';
import { Box, Skeleton, Paper } from '@mui/material';

// Skeleton สำหรับ KPI Card (4 cards)
export const KpiCardSkeleton = () => (
    <Paper
        sx={{
            p: 2,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            backgroundImage: 'none',
        }}
    >
        <Skeleton variant="text" width="60%" height={16} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={36} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="50%" height={14} sx={{ mb: 1.5 }} />
        <Skeleton variant="rectangular" width="100%" height={6} sx={{ borderRadius: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Skeleton variant="text" width="40%" height={12} />
            <Skeleton variant="text" width="30%" height={12} />
        </Box>
    </Paper>
);

// Skeleton Grid สำหรับ 4 KPI Cards
export const KpiGridSkeleton = () => (
    <Box
        sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 2,
            mb: 2,
        }}
    >
        {Array.from({ length: 4 }).map((_, nIdx) => (
            <KpiCardSkeleton key={nIdx} />
        ))}
    </Box>
);

// Skeleton สำหรับ Transaction row (5 rows)
export const TransactionRowSkeleton = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
        <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={18} />
            <Skeleton variant="text" width="40%" height={14} />
        </Box>
        <Skeleton variant="text" width={80} height={18} />
        <Skeleton variant="text" width={70} height={18} />
        <Skeleton variant="rectangular" width={60} height={22} sx={{ borderRadius: 3 }} />
    </Box>
);

// Skeleton สำหรับ Recent Transactions panel (5 rows)
export const TransactionTableSkeleton = () => (
    <Paper
        sx={{
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            backgroundImage: 'none',
        }}
    >
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
        {Array.from({ length: 5 }).map((_, nIdx) => (
            <TransactionRowSkeleton key={nIdx} />
        ))}
    </Paper>
);

// Skeleton สำหรับ Chart panel
export const ChartSkeleton = () => (
    <Paper
        sx={{
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            backgroundImage: 'none',
        }}
    >
        <Skeleton variant="text" width="30%" height={24} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={220} sx={{ borderRadius: 2 }} />
    </Paper>
);
