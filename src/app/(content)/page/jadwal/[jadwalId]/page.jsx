'use client';

import { useSeeKehadiranByJadwalQuery } from '@/src/hooks/api/kehadiranSliceAPI';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function DetailJadwal() {
    const { jadwalId } = useParams();
    const { data: siswaKehadiran, isLoading } = useSeeKehadiranByJadwalQuery({ jadwalId });
    
    const siswaList = siswaKehadiran?.data?.siswa ?? [];
    
    const [statusMap, setStatusMap] = useState({});

    const handleStatus = (siswaId, status) => {
        setStatusMap((prev) => ({ ...prev, [siswaId]: status }));
    };

    const statusColor = {
        Hadir: 'bg-emerald-100 text-emerald-700',
        Sakit: 'bg-amber-100 text-amber-700',
        Izin: 'bg-blue-100 text-blue-700',
        Alpha: 'bg-red-100 text-red-700',
    };

    if (isLoading) return <p className="p-6 text-sm text-gray-400">Memuat data...</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Input Kehadiran</h1>
                    <p className="text-sm text-gray-500 mt-1">{siswaList.length} siswa</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-5 py-3 text-left">No</th>
                                <th className="px-5 py-3 text-left">Nama Siswa</th>
                                <th className="px-5 py-3 text-left">NIS</th>
                                <th className="px-5 py-3 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {siswaList.map((siswa, i) => (
                                <tr key={siswa.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3 text-gray-400">{i + 1}</td>
                                    <td className="px-5 py-3 font-medium text-gray-800">{siswa.namaSiswa}</td>
                                    <td className="px-5 py-3 text-gray-500">{siswa.nis ?? '-'}</td>
                                    <td className="px-5 py-3">
                                        <select
                                            value={statusMap[siswa.id] ?? 'Hadir'}
                                            onChange={(e) => handleStatus(siswa.id, e.target.value)}
                                            className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer ${statusColor[statusMap[siswa.id] ?? 'Hadir']}`}
                                        >
                                            <option value="Hadir">Hadir</option>
                                            <option value="Izin">Izin</option>
                                            <option value="Sakit">Sakit</option>
                                            <option value="Alpha">Alpha</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Tombol Simpan */}
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => console.log(statusMap)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                    >
                        Simpan Kehadiran
                    </button>
                </div>
            </div>
        </div>
    );
}