import { INavigationItem } from '@/shared';
import { Dashboard, AutoGraph, SwapVert, Sync, Label, Warning, Settings } from '@mui/icons-material';

export const lstNavItems: INavigationItem[] = [
    { sLabel: 'หน้าแรก', sRoute: '/dashboard', sIcon: <Dashboard fontSize="small" />, sGroup: 'Overview' },
    { sLabel: 'สถานการณ์', sRoute: '/scenarios', sIcon: <AutoGraph fontSize="small" />, sGroup: 'Overview' },
    { sLabel: 'ธุรกรรมทั้งหมด', sRoute: '/transactions', sIcon: <SwapVert fontSize="small" />, sGroup: 'Transactions' },
    { sLabel: 'รายการประจำ', sRoute: '/recurring', sIcon: <Sync fontSize="small" />, sGroup: 'Transactions' },
    { sLabel: 'โครงการ', sRoute: '/tags', sIcon: <Label fontSize="small" />, sGroup: 'Transactions' },
    { sLabel: 'การแจ้งเตือน', sRoute: '/anomalies', sIcon: <Warning fontSize="small" />, sGroup: 'Analytics', roles: ['Admin', 'Manager'] },
    { sLabel: 'ตั้งค่า', sRoute: '/settings', sIcon: <Settings fontSize="small" />, sGroup: 'System', roles: ['Admin', 'Manager'] },
];