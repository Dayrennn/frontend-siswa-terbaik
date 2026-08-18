'use client';

import { useSeeAllSiswaQuery, useRemoveSiswaMutation } from '@/src/hooks/api/siswaSliceAPI';
import { useState, useMemo } from 'react';
import CreateModal from '@/src/app/conponents/modal/crud/createModal';
import EditModal from '@/src/app/conponents/modal/crud/editModal';
import RemoveModal from '@/src/app/conponents/modal/crud/deleteModal';
import { FaUserPlus } from 'react-icons/fa';
import Table from '@/src/app/conponents/table/page';
import FormTambahSiswa from '@/src/app/conponents/form/crud/tambah-data/siswa';
import FormEditDataSiswa from '@/src/app/conponents/form/crud/edit-data/siswa';
import { exportToExcel } from '@/src/hooks/utils/excelHelper';
import { selectUser } from '@/src/hooks/api/authSliceAPI';
import { useSelector } from 'react-redux';

export default function DataSemuaSiswa() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    const [keyword, setKeyword] = useState('');

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const pageSizeOptions = [10, 50, 100];

    const [deleteSiswa] = useRemoveSiswaMutation();
    const [removeSiswa, setRemoveSiswa] = useState(null);

    const user = useSelector(selectUser);
    const isAdmin = user?.role === 'Admin';
    const isGuru = user?.role === 'Guru';
    const isWaliKelas = user?.role === 'WaliKelas';
    const isWakilKepalaSekolah = user?.role === 'WakilKepalaSekolah';
    const canCreateOrEdit = isAdmin || isGuru || isWaliKelas || isWakilKepalaSekolah;
    const canDelete = isAdmin || isWaliKelas || isWakilKepalaSekolah;

    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
        setPage(1);
    };

    const handleRemove = (siswa) => {
        setRemoveSiswa(siswa);
        setShowRemoveModal(true);
    };

    const handleDelete = async (id) => {
        await deleteSiswa(id).unwrap();
    };

    const [selectedSiswa, setSelectedSiswa] = useState(null);
    const handleEdit = (siswa) => {
        setSelectedSiswa(siswa);
        setShowEditModal(true);
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

    const totalKelas = new Set(siswaList.map((s) => s.kelas?.kodeKelas).filter(Boolean)).size;

    const columns = [
        { key: 'no', label: 'No' },
        {
            key: 'namaSiswa',
            label: 'Nama Siswa',
            render: (row) => (
                <span className="font-medium text-gray-800 whitespace-nowrap">{row.namaSiswa || '-'}</span>
            ),
        },
        {
            key: 'tanggalLahir',
            label: 'Tanggal Lahir',
            render: (row) => (
                <span className="text-sm text-gray-500 whitespace-nowrap">
                    {row.tanggalLahir?.split('T')[0] || '-'}
                </span>
            ),
        },
        {
            key: 'tahunAjaran',
            label: 'Tahun Ajaran',
            render: (row) => (
                <span className="text-sm text-gray-500 whitespace-nowrap">
                    {row.tahunAjaran?.namaTahunAjaran || '-'}
                </span>
            ),
        },
        {
            key: 'kelas',
            label: 'Kelas',
            render: (row) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 whitespace-nowrap">
                    {row.kelas ? `${row.kelas.kodeKelas} · ${row.kelas.namaKelas}` : '-'}
                </span>
            ),
        },
        canCreateOrEdit && {
            key: 'aksi',
            label: 'Aksi',
            render: (row) => (
                <div className="flex flex-wrap sm:flex-nowrap gap-1.5 sm:gap-2 min-w-[140px]">
                    {canCreateOrEdit && (
                        <button
                            onClick={() => handleEdit(row)}
                            className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors font-medium whitespace-nowrap"
                        >
                            ✏️ Edit
                        </button>
                    )}
                    {canDelete && (
                        <button
                            onClick={() => handleRemove(row)}
                            className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-600 px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium whitespace-nowrap"
                        >
                            🗑️ Hapus
                        </button>
                    )}
                </div>
            ),
        },
    ];

    const handleExport = () => exportToExcel(tableData, []);

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-4 sm:mb-5">
                        <h1 className="text-lg sm:text-xl font-medium text-gray-900">Data Siswa</h1>
                        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Seluruh data siswa terdaftar</p>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5">
                        <div className="bg-white rounded-xl border border-gray-100 px-3 sm:px-4 py-2.5 sm:py-3">
                            <p className="text-xs text-gray-400 mb-1">Total Siswa</p>
                            <p className="text-xl sm:text-2xl font-medium text-gray-800">{totalSiswa}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 px-3 sm:px-4 py-2.5 sm:py-3">
                            <p className="text-xs text-gray-400 mb-1">Total Kelas (di halaman ini)</p>
                            <p className="text-xl sm:text-2xl font-medium text-gray-800">{totalKelas}</p>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-5">
                        {/* Toolbar */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
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

                            {/* Buttons */}
                            {canCreateOrEdit && (
                                <div className="flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                                    <button
                                        onClick={handleExport}
                                        className="inline-flex items-center justify-center gap-1.5 text-sm text-white bg-green-500 px-3.5 py-2 rounded-lg hover:bg-green-600 transition-colors w-full sm:w-auto"
                                    >
                                        📤 Export
                                    </button>
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="inline-flex items-center justify-center gap-1.5 text-sm text-white bg-green-500 px-3.5 py-2 rounded-lg hover:bg-green-600 transition-colors w-full sm:w-auto"
                                    >
                                        Tambah Siswa
                                    </button>
                                </div>
                            )}
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

            {showCreateModal && (
                <CreateModal
                    onCancel={() => setShowCreateModal(false)}
                    icon={<FaUserPlus />}
                    title="Tambah Siswa"
                    formTambah={FormTambahSiswa}
                    successTitle="Siswa Berhasil Dibuat"
                    successMessage="Berhasil"
                />
            )}
            {showEditModal && (
                <EditModal
                    onCancel={() => setShowEditModal(false)}
                    icon={<FaUserPlus />}
                    title="Edit Siswa"
                    formEdit={FormEditDataSiswa}
                    initialData={selectedSiswa}
                    successTitle="Siswa Berhasil di Update"
                    successMessage="Berhasil"
                />
            )}
            {showRemoveModal && (
                <RemoveModal
                    onCancel={() => setShowRemoveModal(false)}
                    icon={<FaUserPlus />}
                    title="Hapus Siswa"
                    initialData={removeSiswa}
                    displayName="namaSiswa"
                    onConfirm={handleDelete}
                    successTitle="Siswa Berhasil di Hapus"
                    successMessage="Berhasil"
                />
            )}
        </>
    );
}
