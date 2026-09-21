'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const HomeRedirect = () => {
    const objRouter = useRouter();

    useEffect(() => {
        objRouter.replace('/procurement');
    }, [objRouter]);

    return null;
};
