'use client';

import { useState, useEffect } from 'react';

/**
 * Hook สำหรับทำอนิเมชันตัวเลขค่อยๆ เพิ่มขึ้นจาก 0 ไปจนถึง nTargetValue
 * @param nTargetValue ค่าเป้าหมายที่ต้องการแสดงผล
 * @param nDuration ระยะเวลาในการทำอนิเมชัน (มิลลิวินาที)
 * @returns ตัวเลข ณ เวลาปัจจุบันของอนิเมชัน
 */
export const useCountUp = (nTargetValue: number, nDuration: number = 2000): number => {
    const [nCount, setNCount] = useState<number>(0);

    useEffect(() => {
        let nStartTimestamp: number | null = null;
        const nStartValue = 0;
        let nAnimationFrameId: number;
        // ฟังก์ชันสำหรับทำอนิเมชันตัวเลขค่อยๆ เพิ่มขึ้น
        const step = (nTimestamp: number) => {
            // ตรวจสอบว่า nStartTimestamp เป็น null
            if (!nStartTimestamp) {
                // กำหนดค่า nStartTimestamp เป็น nTimestamp
                nStartTimestamp = nTimestamp;
            }
            // คำนวณค่า nProgress
            const nProgress = Math.min((nTimestamp - nStartTimestamp) / nDuration, 1);
            // คำนวณค่า nEaseProgress
            const nEaseProgress = nProgress * (2 - nProgress);
            // คำนวณค่าnCurrentValue
            const nCurrentValue = nStartValue + nEaseProgress * (nTargetValue - nStartValue);

            setNCount(nCurrentValue);
            // ถ้า nProgress น้อยกว่า 1
            if (nProgress < 1) {
                // ขอเฟรมต่อไป
                nAnimationFrameId = requestAnimationFrame(step);
            } else {
                // ถ้า nProgress เท่ากับ 1
                setNCount(nTargetValue);
            }
        };
        // ขอเฟรมแรก
        nAnimationFrameId = requestAnimationFrame(step);
        // ยกเลิกเฟรมเมื่อ component unmount
        return () => {
            if (nAnimationFrameId) {
                cancelAnimationFrame(nAnimationFrameId);
            }
        };
        // Dependencies: เมื่อค่า nTargetValue หรือ nDuration เปลี่ยนแปลง จะทำการ re-run effect
    }, [nTargetValue, nDuration]);

    return nCount;
};
