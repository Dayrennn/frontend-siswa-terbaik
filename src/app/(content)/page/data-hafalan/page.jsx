'use client';

import { siswaAPI, useSeeAllSiswaByHafalanQuery } from '@/src/hooks/api/siswaSliceAPI';
import Table from '@/src/app/conponents/table/page';
import EditModal from '@/src/app/conponents/modal/crud/editModal';
import { useState } from 'react';
import FormEditHafalan from '@/src/app/conponents/form/crud/edit-data/hafalan';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@/src/hooks/api/authSliceAPI';
import { PencilIcon } from 'lucide-react';

export default function SiswaHafalanPage() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const pageSizeOptions = [10, 50, 100];

    const isAdmin = user?.role === 'Admin';
    const isWaliKelas = user?.role === 'WaliKelas';
    const isWakilKepalaSekolah = user?.role === 'WakilKepalaSekolah';
    const canEdit = isAdmin || isWaliKelas || isWakilKepalaSekolah;

    const [showEditModal, setShowEditModal] = useState(false);

    const {
        data: siswaList,
        isLoading,
        isError,
        error,
    } = useSeeAllSiswaByHafalanQuery({ page, limit: pageSize, search: keyword });
    const data = siswaList?.data?.siswa ?? [];
    const meta = siswaList?.data?.data ?? { page: 1, limit: pageSize, total: 0, totalPages: 1 };

    const totalSiswa = meta.total ?? 0;
    const totalPages = meta.totalPages ?? 1;
    const currentPage = meta.page ?? page;

    const tableData = data.map((siswa, index) => ({ no: index + 1, ...siswa }));

    const [selectedSiswa, setSelectedSiswa] = useState(null);
    const handleEdit = (siswa) => {
        setSelectedSiswa(siswa);
        setShowEditModal(true);
    };

    const handleAfterSuccess = () => {
        dispatch(siswaAPI.util.invalidateTags(['siswaAPI']));
    };

    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
        setPage(1);
    };

    const columns = [
        { key: 'no', label: 'No' },
        {
            key: 'namaSiswa',
            label: 'Nama Siswa',
            render: (row) => <span className="font-medium text-gray-800">{row.namaSiswa || '-'}</span>,
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
            key: 'tahunAjaran',
            label: 'Tahun Ajaran',
            render: (row) => <span className="text-sm text-gray-500">{row.tahunAjaran?.namaTahunAjaran || '-'}</span>,
        },
        {
            key: 'hafalan',
            label: 'Hafalan',
            render: (row) =>
                row.hafalan ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                        {row.hafalan.jumlahJuz} Juz
                    </span>
                ) : (
                    <span className="text-xs text-gray-400">Belum ada catatan</span>
                ),
        },
        {
            key: 'keterangan',
            label: 'Keterangan',
            render: (row) => <span className="text-sm text-gray-500">{row.hafalan?.keterangan || '-'}</span>,
        },
        {
            key: 'aksi',
            label: 'Aksi',
            render: (row) => (
                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    {canEdit && (
                        <>
                            <button
                                type="button"
                                onClick={() => handleEdit(row)}
                                className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium cursor-pointer"
                            >
                                <PencilIcon className="h-3.5 w-3.5" />
                                Edit
                            </button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-4 sm:mb-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Rekap Tahfidz</p>
                    <h1 className="text-lg sm:text-xl font-medium text-gray-900">Data Hafalan Siswa</h1>
                    <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Rekap hafalan tahfidz seluruh siswa</p>
                </div>
                <div className="relative w-full md:w-72">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm">🔍</span>
                    <input
                        type="text"
                        placeholder="Cari nama siswa..."
                        value={keyword}
                        onChange={handleKeywordChange}
                        className="w-full pl-8 pr-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                    />
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-5">
                    {isLoading && <p className="text-center text-gray-400 py-12 text-sm">Memuat data...</p>}

                    {isError && (
                        <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-400">
                            {error?.data?.message ?? 'Gagal mengambil data. Coba muat ulang halaman.'}
                        </div>
                    )}

                    {!isLoading && !isError && <Table columns={columns} data={tableData} />}

                    {/* Footer */}
                    {!isLoading && !isError && (
                        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="text-xs text-gray-400 text-center sm:text-left">
                                Menampilkan {data.length} dari {totalSiswa} siswa (halaman {currentPage})
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
                                        disabled={currentPage <= 1 || isLoading}
                                        className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                    >
                                        ← Prev
                                    </button>
                                    <span className="text-xs text-gray-500 px-1 whitespace-nowrap">
                                        Hal {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage >= totalPages || isLoading}
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
            {showEditModal && (
                <EditModal
                    onCancel={() => setShowEditModal(false)}
                    title={'Edit Hafalan'}
                    formEdit={FormEditHafalan}
                    initialData={selectedSiswa}
                    successTitle={'Berhasil'}
                    successMessage={'Berhasil Edit Hafalan'}
                    onAfterSuccess={handleAfterSuccess}
                />
            )}
        </div>
    );
}
