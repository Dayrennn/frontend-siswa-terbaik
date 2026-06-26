'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '@/src/hooks/api/authSliceAPI';
import { selectToken } from '@/src/hooks/api/authSliceAPI';

export default function AuthProvider({ children }) {
    const dispatch = useDispatch();
    const existingToken = useSelector(selectToken);

    useEffect(() => {
        // Hanya restore dari localStorage jika Redux belum punya token
        if (existingToken) return;

        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
            try {
                dispatch(setCredentials({
                    token,
                    user: JSON.parse(user),
                }));
            } catch {
                // localStorage corrupt, bersihkan
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }, [dispatch, existingToken]);

    return children;
}