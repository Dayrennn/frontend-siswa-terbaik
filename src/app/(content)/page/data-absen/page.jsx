'use client';

import { useSeeAllSiswaQuery } from '@/src/hooks/api/siswaSliceAPI';
import { useState } from 'react';
import Table from '@/src/app/conponents/table/page';
import Link from 'next/link';

export default function DataAbsen() {
    const [search, setSearch] = useState('');

    const { data, isLoading, isError } = useSeeAllSiswaQuery();

    const tableData =
        data?.data
            ?.data?.map((siswa, index) => ({ no: index + 1, ...siswa }))
            .filter((item) => {
                const keyword = search.toLowerCase();
                return Object.values(item).some((value) =>
                    String(value ?? '')
                        .toLowerCase()
                        .includes(keyword),
                );
            }) ?? [];

    const totalSiswa = data?.data?.length ?? 0;

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
                            Lihat Data →
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
                                    placeholder="Cari nama, kelas, atau data siswa..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-8 pr-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        {isLoading && <p className="text-center text-gray-400 py-12 text-sm">Memuat data...</p>}
                        {isError && <p className="text-center text-red-400 py-12 text-sm">Gagal memuat data</p>}
                        {!isLoading && !isError && <Table columns={columns} data={tableData} />}

                        {/* Footer */}
                        {!isLoading && !isError && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-400">
                                    Menampilkan {tableData.length} dari {totalSiswa} siswa
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
