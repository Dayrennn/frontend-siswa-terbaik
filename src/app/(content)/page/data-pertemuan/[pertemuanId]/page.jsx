'use client';

import { useParams } from 'next/navigation';
import { useSeeOnePertemuanByIdQuery } from '../../../../../hooks/api/pertemuanSliceAPI';

const STATUS_STYLE = {
    Hadir: 'bg-green-50 text-green-700',
    Izin: 'bg-blue-50 text-blue-700',
    Sakit: 'bg-amber-50 text-amber-700',
    Alpha: 'bg-red-50 text-red-600',
};

export default function DetailPertemuan() {
    const { pertemuanId } = useParams();

    const { data, isLoading, isError } = useSeeOnePertemuanByIdQuery(pertemuanId);
    const pertemuan = data?.data;
    const kehadiranList = pertemuan?.kehadiran ?? [];

    const totalHadir = kehadiranList.filter((k) => k.statusKehadiran === 'Hadir').length;
    const totalIzin = kehadiranList.filter((k) => k.statusKehadiran === 'Izin').length;
    const totalSakit = kehadiranList.filter((k) => k.statusKehadiran === 'Sakit').length;
    const totalAlpha = kehadiranList.filter((k) => k.statusKehadiran === 'Alpha').length;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-5">
                    <h1 className="text-xl font-medium text-gray-900">
                        {pertemuan?.namaPertemuan ?? 'Detail Pertemuan'}
                    </h1>
                    <p className="text-sm text-gray-400 mt-0.5">Data kehadiran siswa</p>
                </div>

                {isLoading && <p className="text-center text-gray-400 py-12 text-sm">Memuat data...</p>}
                {isError && <p className="text-center text-red-400 py-12 text-sm">Gagal memuat data</p>}

                {!isLoading && !isError && pertemuan && (
                    <>
                        {/* Stat Cards */}
                        {kehadiranList.length > 0 && (
                            <div className="grid grid-cols-4 gap-3 mb-5">
                                <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                                    <p className="text-xs text-gray-400 mb-1">Hadir</p>
                                    <p className="text-2xl font-medium text-green-600">{totalHadir}</p>
                                </div>
                                <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                                    <p className="text-xs text-gray-400 mb-1">Izin</p>
                                    <p className="text-2xl font-medium text-blue-600">{totalIzin}</p>
                                </div>
                                <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                                    <p className="text-xs text-gray-400 mb-1">Sakit</p>
                                    <p className="text-2xl font-medium text-amber-600">{totalSakit}</p>
                                </div>
                                <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                                    <p className="text-xs text-gray-400 mb-1">Alpha</p>
                                    <p className="text-2xl font-medium text-red-600">{totalAlpha}</p>
                                </div>
                            </div>
                        )}

                        {/* Tabel Kehadiran */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                            {kehadiranList.length === 0 ? (
                                <p className="text-center text-gray-400 py-8 text-sm">Belum ada data kehadiran</p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left py-2 px-3 text-xs text-gray-400 font-medium">No</th>
                                            <th className="text-left py-2 px-3 text-xs text-gray-400 font-medium">Nama Siswa</th>
                                            <th className="text-left py-2 px-3 text-xs text-gray-400 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {kehadiranList.map((item, index) => (
                                            <tr key={index} className="border-b border-gray-50">
                                                <td className="py-2 px-3 text-gray-500">{index + 1}</td>
                                                <td className="py-2 px-3 font-medium text-gray-800">
                                                    {item.siswa?.namaSiswa ?? '-'}
                                                </td>
                                                <td className="py-2 px-3">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[item.statusKehadiran] ?? 'bg-gray-100 text-gray-500'}`}>
                                                        ● {item.statusKehadiran}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {/* Footer */}
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-400">{kehadiranList.length} data kehadiran ditampilkan</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}