'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';

import { useGetKehadiranByKelasQuery, useSimpanKehadiranMutation } from '../../../hooks/api/kehadiranSliceAPI';

const STATUS_OPTIONS = ['Hadir', 'Izin', 'Sakit', 'Alpha'];

const STATUS_STYLE = {
    Hadir: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    Izin: 'bg-blue-100   text-blue-700   border border-blue-200',
    Sakit: 'bg-amber-100  text-amber-700  border border-amber-200',
    Alpha: 'bg-red-100    text-red-600    border border-red-200',
};

function getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default function TabKehadiran() {
    const { tahunAjaranId, kelasId } = useParams();
    const tanggal = getTodayString(); // ← tidak pakai state, selalu hari ini

    const [statusMap, setStatusMap] = useState({});
    const [saved, setSaved] = useState(false);

    const { data, isLoading, isError } = useGetKehadiranByKelasQuery({ kelasId, tahunAjaranId, tanggal });

    const [simpanKehadiran, { isLoading: isSaving }] = useSimpanKehadiranMutation();

    const siswaList = data?.data ?? [];

    const getStatus = (siswaId) => {
        if (statusMap[siswaId] !== undefined) return statusMap[siswaId];
        const fromServer = siswaList.find((s) => s.id === siswaId)?.statusKehadiran;
        return fromServer ?? 'Alpha';
    };

    const handleStatusChange = (siswaId, status) => {
        setSaved(false);
        setStatusMap((prev) => ({ ...prev, [siswaId]: status }));
    };

    const handleSetAll = (status) => {
        const newMap = Object.fromEntries(siswaList.map((s) => [s.id, status]));
        setStatusMap(newMap);
        setSaved(false);
    };

    const handleSimpan = async () => {
        const kehadiran = siswaList.map((siswa) => ({
            siswaId: siswa.id,
            statusKehadiran: getStatus(siswa.id),
        }));

        try {
            await simpanKehadiran({ kelasId, tahunAjaranId, tanggal, kehadiran }).unwrap();
            setSaved(true);
        } catch (err) {
            console.error('Gagal simpan kehadiran:', err);
        }
    };

    const rekap = STATUS_OPTIONS.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
    siswaList.forEach((siswa) => {
        const s = getStatus(siswa.id);
        rekap[s] = (rekap[s] ?? 0) + 1;
    });

    return (
        <div className="space-y-5">
            {/* ── Header: shortcut set all saja ── */}
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Set semua:</span>
                {STATUS_OPTIONS.map((s) => (
                    <button
                        key={s}
                        onClick={() => handleSetAll(s)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${STATUS_STYLE[s]}`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* ── Rekap bar ── */}
            <div className="grid grid-cols-4 gap-3">
                {STATUS_OPTIONS.map((s) => (
                    <div key={s} className={`rounded-xl px-4 py-3 ${STATUS_STYLE[s]}`}>
                        <p className="text-xs font-medium opacity-70">{s}</p>
                        <p className="text-2xl font-bold mt-0.5">{rekap[s]}</p>
                    </div>
                ))}
            </div>

            {/* ── Tabel ── */}
            {isLoading && <p className="text-center text-gray-400 py-10">Memuat data kehadiran...</p>}
            {isError && <p className="text-center text-red-400 py-10">Gagal memuat data kehadiran</p>}

            {!isLoading && !isError && (
                <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                                <th className="text-left px-4 py-3 w-10">No</th>
                                <th className="text-left px-4 py-3">NIS</th>
                                <th className="text-left px-4 py-3">Nama Siswa</th>
                                <th className="text-left px-4 py-3 w-44">Status Kehadiran</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {siswaList.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center text-gray-400 py-10">
                                        Tidak ada data siswa
                                    </td>
                                </tr>
                            )}
                            {siswaList.map((siswa, idx) => {
                                const status = getStatus(siswa.id);
                                return (
                                    <tr key={siswa.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                                        <td className="px-4 py-3 text-gray-500">{siswa.nis || '-'}</td>
                                        <td className="px-4 py-3 font-medium text-gray-700">{siswa.namaSiswa}</td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={status}
                                                onChange={(e) => handleStatusChange(siswa.id, e.target.value)}
                                                className={`text-xs font-medium px-3 py-1.5 rounded-lg border-0 outline-none cursor-pointer transition-all ${STATUS_STYLE[status]}`}
                                            >
                                                {STATUS_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt}>
                                                        {opt}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Tombol simpan ── */}
            {!isLoading && siswaList.length > 0 && (
                <div className="flex items-center justify-end gap-3">
                    {saved && <span className="text-sm text-emerald-600 font-medium">✓ Kehadiran tersimpan</span>}
                    <button
                        onClick={handleSimpan}
                        disabled={isSaving}
                        className="px-5 py-2 bg-blue-500 text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-60"
                    >
                        {isSaving ? 'Menyimpan...' : 'Simpan Kehadiran'}
                    </button>
                </div>
            )}
        </div>
    );
}
