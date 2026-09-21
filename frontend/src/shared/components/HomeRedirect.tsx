'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/modules/auth';

export const HomeRedirect = () => {
    const objRouter = useRouter();
    const { objUser, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (objUser) {
                objRouter.replace('/procurement');
            } else {
                objRouter.replace('/login');
            }
        }
    }, [objUser, isLoading, objRouter]);

    return null;
};
