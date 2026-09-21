'use client';

import { useState, useCallback } from 'react';
import { SelectChangeEvent } from '@mui/material';

interface IUseTagFilterReturn<T> {
    lstMutiFilter: T[];
    setLstMutiFilter: React.Dispatch<React.SetStateAction<T[]>>;
    handleTagFilterChange: (e: SelectChangeEvent<T[]>) => void;
    getTagFilterDisplayText: (selected: T[], getName?: (val: T) => string) => string;
}

/**
 @param lstInitialFilter - ค่าเริ่มต้นของ filter (default: ['All'])
 @param allVal - ค่าที่แสดงถึง "ทั้งหมด" (default: 'All')
 @returns object ที่มี state และ handler สำหรับจัดการ tag filter
 */
export const useTagFilter = <T extends string | number = string>(
    lstInitialFilter: T[] = ['All' as T],
    allVal: T = 'All' as T
): IUseTagFilterReturn<T> => {
    const [lstMutiFilter, setLstMutiFilter] = useState<T[]>(lstInitialFilter);

    // จัดการการเปลี่ยนตัวกรองโปรเจกต์
    const handleTagFilterChange = useCallback((e: SelectChangeEvent<T[]>) => {
        const lstSelectedValues = e.target.value as T[];
        const isAllCurrentlySelected = lstMutiFilter.includes(allVal);
        const isAllNewlySelected = lstSelectedValues.includes(allVal);

        if (isAllNewlySelected && !isAllCurrentlySelected) {
            // เลือก "All" ใหม่ → reset เป็น All อย่างเดียว
            setLstMutiFilter([allVal]);
        } else if (isAllCurrentlySelected && lstSelectedValues.length > 1) {
            // มี "All" อยู่แล้ว แต่เลือกตัวอื่นเพิ่ม → เอา All ออก
            setLstMutiFilter(lstSelectedValues.filter(sVal => sVal !== allVal));
        } else if (lstSelectedValues.length === 0) {
            // ไม่เลือกอะไรเลย → กลับเป็น All
            setLstMutiFilter([allVal]);
        } else {
            setLstMutiFilter(lstSelectedValues);
        }
    }, [lstMutiFilter, allVal]);

    // จัดการแสดงผลข้อความตัวกรองโปรเจกต์ที่เลือก
    const getTagFilterDisplayText = useCallback((selected: T[], getName?: (val: T) => string): string => {
        if (selected.includes(allVal) || selected.length === 0) {
            return 'ทุกโครงการ';
        }
        if (selected.length === 1) {
            return getName ? getName(selected[0]) : String(selected[0]);
        }
        return `${selected.length} โครงการ`;
    }, [allVal]);

    return {
        lstMutiFilter,
        setLstMutiFilter,
        handleTagFilterChange,
        getTagFilterDisplayText,
    };
};
