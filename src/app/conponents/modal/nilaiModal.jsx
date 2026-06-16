'use client'

import { useGetSiswaByIdQuery } from "@/src/hooks/api/siswaSliceAPI"

export default function NilaiModal({ siswaId, onCancel, icon, title }) {
    const { data, isLoading, isError } = useGetSiswaByIdQuery(siswaId);
    const siswa = data?.data;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-5 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {icon}
                        <h2 className="font-semibold">{title}</h2>
                    </div>
                    <button onClick={onCancel} className="text-white/80 hover:text-white text-lg">✕</button>
                </div>

                {/* Body */}
                <div className="p-5 max-h-[75vh] overflow-y-auto">
                    {isLoading && (
                        <div className="flex justify-center items-center py-10 text-gray-400">
                            <span>Memuat data...</span>
                        </div>
                    )}

                    {isError && (
                        <div className="text-center py-10 text-red-500">
                            Gagal memuat data siswa.
                        </div>
                    )}

                    {siswa && (
                        <div className="space-y-5">
                            {/* Info Siswa */}
                            <div className="flex items-center gap-3 bg-indigo-50 rounded-xl p-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                                    {siswa.namaSiswa?.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{siswa.namaSiswa}</p>
                                    <p className="text-sm text-gray-500">NIS: {siswa.nis ?? '-'}</p>
                                </div>
                            </div>

                            {/* Tabel Nilai Pelajaran */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    Nilai Pelajaran
                                </h3>
                                <div className="rounded-xl border border-gray-200 overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 text-gray-500">
                                            <tr>
                                                <th className="text-left px-4 py-2 font-medium">Pelajaran</th>
                                                <th className="text-left px-4 py-2 font-medium">Kode</th>
                                                <th className="text-right px-4 py-2 font-medium">Nilai</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {siswa.nilai?.length > 0 ? siswa.nilai.map((item) => (
                                                <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-2 text-gray-800">{item.pelajaran.namaPelajaran}</td>
                                                    <td className="px-4 py-2">
                                                        <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
                                                            {item.pelajaran.kodePelajaran}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-right">
                                                        <span className={`font-semibold ${item.nilai >= 75 ? 'text-green-600' : item.nilai > 0 ? 'text-amber-500' : 'text-gray-400'}`}>
                                                            {item.nilai}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={3} className="text-center text-gray-400 py-4">Belum ada nilai</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    Kehadiran
                                </h3>
                                <div className="rounded-xl border border-gray-200 overflow-hidden">
                                    <table className="w-full text-sm">
                                        <tbody className="divide-y divide-gray-100">
                                            {siswa.nilaiKriteria?.length > 0 ? siswa.nilaiKriteria.map((item) => (
                                                <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-2 text-gray-800">Total Kehadiran</td>
                                                    <td className="px-4 py-2 text-right">
                                                        <span className={`font-semibold ${item.nilai >= 75 ? 'text-green-600' : item.nilai > 0 ? 'text-amber-500' : 'text-gray-400'}`}>
                                                            {siswa.ringkasan?.totalKehadiran ?? 0}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={4} className="text-center text-gray-400 py-4">Belum ada nilai kriteria</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    Eskul
                                </h3>
                                <div className="rounded-xl border border-gray-200 overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 text-gray-500">
                                            <tr>
                                                <th className="text-left px-4 py-2 font-medium">Kriteria</th>
                                                <th className="text-right px-4 py-2 font-medium">Nilai</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {siswa.eskul?.length > 0 ? siswa.eskul.map((item) => (
                                                <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-2 text-gray-800">{item.eskul.namaEskul}</td>
                                                    <td className="px-4 py-2 text-right">
                                                        <span className={`font-semibold ${item.nilai >= 75 ? 'text-green-600' : item.nilai > 0 ? 'text-amber-500' : 'text-gray-400'}`}>
                                                            {item.nilai}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={4} className="text-center text-gray-400 py-4">Belum ada nilai eskul</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Tabel Nilai Kriteria */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    Nilai Kriteria
                                </h3>
                                <div className="rounded-xl border border-gray-200 overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 text-gray-500">
                                            <tr>
                                                <th className="text-left px-4 py-2 font-medium">Kriteria</th>
                                                <th className="text-left px-4 py-2 font-medium">Jenis</th>
                                                <th className="text-right px-4 py-2 font-medium">Nilai</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {siswa.nilaiKriteria?.length > 0 ? siswa.nilaiKriteria.map((item) => (
                                                <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-2 text-gray-800">{item.kriteria.namaKriteria}</td>
                                                    <td className="px-4 py-2">
                                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.kriteria.jenis === 'Benefit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {item.kriteria.jenis}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-right">
                                                        <span className={`font-semibold ${item.nilai >= 75 ? 'text-green-600' : item.nilai > 0 ? 'text-amber-500' : 'text-gray-400'}`}>
                                                            {item.nilai}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={4} className="text-center text-gray-400 py-4">Belum ada nilai kriteria</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}