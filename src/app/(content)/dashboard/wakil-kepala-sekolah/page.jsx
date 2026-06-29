'use client';

import StatsCard from '../../../conponents/card/statsCard';
import { IoMdPeople } from 'react-icons/io';
import { FaChalkboardTeacher, FaClipboardList, FaTrophy } from 'react-icons/fa';
import { useSeeAllHomeDataQuery } from '@/src/hooks/api/homeSliceAPI';
import { selectUser } from '@/src/hooks/api/authSliceAPI';
import { useSelector } from 'react-redux';

export default function WakepsekPage() {
    const { data: homeData, isLoading } = useSeeAllHomeDataQuery();
    const user = useSelector(selectUser);
    if (!user) return null;
    const cardItems = [
        {
            title: 'Total Siswa',
            icon: IoMdPeople,
            value: homeData?.data?.totalSiswa ?? 0,
        },
        {
            title: 'Total Pelajaran',
            icon: FaChalkboardTeacher,
            value: homeData?.data?.totalPelajaran ?? 0,
        },
        {
            title: 'Data Kriteria',
            icon: FaClipboardList,
            value: homeData?.data?.totalKriteria ?? 0,
        },
        {
            title: 'Total Kelas',
            icon: FaTrophy,
            value: homeData?.data?.totalKelas ?? 0,
        },
    ];

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard {user.role}</h1>

            <div className="grid grid-cols-4 gap-4 mt-6">
                {cardItems.map((item) => (
                    <StatsCard key={item.title} title={item.title} value={item.value} icon={item.icon} />
                ))}
            </div>
        </div>
    );
}
