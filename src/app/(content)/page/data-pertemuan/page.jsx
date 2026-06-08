'use client';

import { useState, useMemo } from 'react';
import PertemuanCard from '@/src/app/conponents/card/pertemuanCard';
import { useSeeAllPertemuanQuery } from '@/src/hooks/api/pertemuanSliceAPI';

const IconEmpty = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
    </svg>
);

export default function PertemuanPage() {
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('newest');

    const {
        data: responseData,
        isLoading,
        isError,
    } = useSeeAllPertemuanQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const pertemuan = responseData?.data ?? [];

    const filtered = useMemo(() => {
        let hasil = pertemuan.filter((p) => p.namaPertemuan.toLowerCase().includes(search.toLowerCase()));
        if (sort === 'newest') hasil = [...hasil].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
        else if (sort === 'oldest') hasil = [...hasil].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
        else if (sort === 'name') hasil = [...hasil].sort((a, b) => a.namaPertemuan.localeCompare(b.namaPertemuan));
        return hasil;
    }, [pertemuan, search, sort]);

    const handleLihat = (item) => console.log('Lihat kehadiran:', item.id);
    const handleEdit = (item) => console.log('Edit pertemuan:', item.id);
    const handleHapus = (item) => console.log('Hapus pertemuan:', item.id);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Daftar Pertemuan</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {responseData?.message ?? 'Memuat data pertemuan...'}
                        </p>
                    </div>
                </div>

                {/* ── Loading ── */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20 text-gray-400">
                        <svg className="w-6 h-6 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth={4}
                            />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span className="text-sm">Memuat data...</span>
                    </div>
                )}

                {/* ── Error ── */}
                {isError && (
                    <div className="flex items-center justify-center py-20 text-red-400">
                        <p className="text-sm">Gagal memuat data pertemuan. Coba refresh halaman.</p>
                    </div>
                )}

                {/* ── Konten utama ── */}
                {!isLoading && !isError && (
                    <>
                        {/* Filter & Search */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            <div className="relative flex-1">
                                <svg
                                    className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.6}
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Cari nama pertemuan..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                                />
                            </div>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition cursor-pointer text-gray-700"
                            >
                                <option value="newest">Terbaru</option>
                                <option value="oldest">Terlama</option>
                                <option value="name">Nama A–Z</option>
                            </select>
                        </div>

                        {/* Total */}
                        <p className="text-xs text-gray-400 mb-4">
                            Menampilkan <span className="font-semibold text-gray-600">{filtered.length}</span> dari{' '}
                            <span className="font-semibold text-gray-600">{pertemuan.length}</span> pertemuan
                        </p>

                        {/* Grid Cards */}
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <IconEmpty className="w-12 h-12 mb-3 opacity-40" />
                                <p className="text-sm font-medium">Tidak ada pertemuan ditemukan</p>
                                <p className="text-xs mt-1 opacity-70">Coba ubah kata kunci pencarian</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filtered.map((item) => (
                                    <PertemuanCard
                                        key={item.id}
                                        item={item}
                                        onLihat={handleLihat}
                                        onEdit={handleEdit}
                                        onHapus={handleHapus}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
