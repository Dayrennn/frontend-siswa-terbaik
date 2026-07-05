'use client';
import Sidebar from '../conponents/sidebar/page';
import { useGetMeQuery } from '../../hooks/api/userSliceAPI';
import { setCredentials } from '../../hooks/api/authSliceAPI';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

export default function DashboardLayout({ children }) {
    const dispatch = useDispatch();
    const { data, isLoading } = useGetMeQuery();

    useEffect(() => {
        if (data?.data) {
            dispatch(setCredentials({ user: data.data }));
        }
    }, [data]);

    if (isLoading)
        return (
            <div className="flex min-h-screen bg-gray-100 items-center justify-center px-4">
                <div className="w-full max-w-md p-4 sm:p-6">
                    {/* BRAND / TITLE */}
                    <div className="text-center mb-6">
                        <div className="text-blue-600 text-lg sm:text-xl font-bold tracking-wide">School Dashboard</div>
                        <p className="text-sm text-gray-500 mt-1 animate-pulse">Memuat data...</p>
                    </div>

                    {/* LOADING CARD */}
                    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5 space-y-4">
                        <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse"></div>

                        <div className="mt-4 space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse shrink-0"></div>
                                    <div className="h-8 flex-1 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-8 w-16 sm:w-20 bg-gray-200 rounded animate-pulse shrink-0"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center mt-6">
                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                </div>
            </div>
        );

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            {/* Konten: tanpa margin di mobile/tablet (sidebar overlay), baru diberi margin di md+ (sidebar permanen) */}
            <div className="flex-1 w-full md:ml-60 min-w-0">
                <main className="p-4 sm:p-6 pt-20 md:pt-6">{children}</main>
            </div>
        </div>
    );
}
