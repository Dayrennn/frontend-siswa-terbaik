'use client';

import { useSeeAllSiswaQuery } from '@/src/hooks/api/siswaSliceAPI';
import { useState } from 'react';
import Table from '@/src/app/conponents/table/page';
import Link from 'next/link';

export default function DataAbsen() {
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const pageSizeOptions = [10, 50, 100];

    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
        setPage(1);
    };

    const { data, isLoading, isFetching, isError } = useSeeAllSiswaQuery({
        page,
        limit: pageSize,
        search: keyword,
    });

    const siswaList = data?.data?.data ?? [];
    const meta = data?.data?.meta ?? { page: 1, limit: pageSize, total: 0, totalPages: 1 };

    const start = (meta.page - 1) * meta.limit;
    const tableData = siswaList.map((siswa, index) => ({ no: start + index + 1, ...siswa }));

    const totalSiswa = meta.total ?? 0;
    const totalPages = meta.totalPages ?? 1;
    const currentPage = meta.page ?? page;

    const columns = [
        { key: 'no', label: 'No' },
        {
            key: 'namaSiswa',
            label: 'Nama Siswa',
            render: (row) => <span className="font-medium text-gray-800">{row.namaSiswa || '-'}</span>,
        },
        {
            key: 'tanggalLahir',
            label: 'Tanggal Lahir',
            render: (row) => <span className="text-sm text-gray-500">{row.tanggalLahir?.split('T')[0] || '-'}</span>,
        },
        {
            key: 'tahunAjaran',
            label: 'Tahun Ajaran',
            render: (row) => <span className="text-sm text-gray-500">{row.tahunAjaran?.namaTahunAjaran || '-'}</span>,
        },
        {
            key: 'kelas',
            label: 'Kelas',
            render: (row) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {row.kelas ? `${row.kelas.kodeKelas} · ${row.kelas.namaKelas}` : '-'}
                </span>
            ),
        },
        {
            key: 'aksi',
            label: 'Aksi',
            render: (row) => (
                <div className="flex gap-2">
                    <Link href={`/page/data-absen/${row.id}`}>
                        <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium cursor-pointer">
                            Lihat Absen
                        </span>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-5">
                        <h1 className="text-xl font-medium text-gray-900">Data Absen</h1>
                        <p className="text-sm text-gray-400 mt-0.5">Seluruh data siswa terdaftar</p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                            {/* Search */}
                            <div className="relative w-full md:w-72">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm">
                                    🔍
                                </span>
                                <input
                                    type="text"
                                    placeholder="Cari nama siswa..."
                                    value={keyword}
                                    onChange={handleKeywordChange}
                                    className="w-full pl-8 pr-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        {isLoading && <p className="text-center text-gray-400 py-12 text-sm">Memuat data...</p>}
                        {isError && <p className="text-center text-red-400 py-12 text-sm">Gagal memuat data</p>}
                        {!isLoading && !isError && <Table columns={columns} data={tableData} />}

                        {/* Footer + Pagination */}
                        {!isLoading && !isError && (
                            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <p className="text-xs text-gray-400 text-center sm:text-left">
                                    Menampilkan {siswaList.length} dari {totalSiswa} siswa (halaman {currentPage})
                                </p>

                                <div className="flex flex-col xs:flex-row sm:flex-row items-center justify-center sm:justify-end gap-2 sm:gap-3">
                                    {/* Page size selector */}
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs text-gray-400 whitespace-nowrap">Tampilkan</span>
                                        <select
                                            value={pageSize}
                                            onChange={(e) => {
                                                setPageSize(Number(e.target.value));
                                                setPage(1);
                                            }}
                                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                        >
                                            {pageSizeOptions.map((size) => (
                                                <option key={size} value={size}>
                                                    {size} data
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Prev / Next */}
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage <= 1 || isFetching}
                                            className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                        >
                                            ← Prev
                                        </button>
                                        <span className="text-xs text-gray-500 px-1 whitespace-nowrap">
                                            Hal {currentPage} / {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={currentPage >= totalPages || isFetching}
                                            className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                        >
                                            Next →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}