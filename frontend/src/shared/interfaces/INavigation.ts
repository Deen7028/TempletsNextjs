import React from 'react';

export interface INavigationItem {
    sLabel: string;
    sRoute: string;
    sIcon: React.ReactNode;
    sGroup: 'Overview' | 'Transactions' | 'Analytics' | 'System';
    nBadgeCount?: number;
    roles?: string[];
}