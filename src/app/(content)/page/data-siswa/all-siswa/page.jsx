'use client';

import {
    useSeeAllSiswaQuery,
    useRemoveSiswaMutation,
} from '../../../../../hooks/api/siswaSliceAPI';
import { useState } from 'react';

import CreateModal from '../../../../conponents/modal/crud/createModal';
import EditModal from '../../../../conponents/modal/crud/editModal';
import RemoveModal from '../../../../conponents/modal/crud/deleteModal';
import { FaUserPlus } from 'react-icons/fa';
import Table from '../../../../conponents/table/page';
import FormTambahSiswa from '../../../../conponents/form/crud/tambah-data/siswa';
import FormEditDataSiswa from '../../../../conponents/form/crud/edit-data/siswa';
import { exportToExcel, parseImportedExcel } from '../../../../../hooks/utils/excelHelper';

export default function DataSemuaSiswa() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [search, setSearch] = useState('');

    const [deleteSiswa] = useRemoveSiswaMutation();
    const [removeSiswa, setRemoveSiswa] = useState(null);

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

    const { data, isLoading, isError } = useSeeAllSiswaQuery();

    const tableData =
        data?.data
            ?.map((siswa, index) => ({ no: index + 1, ...siswa }))
            .filter((item) => {
                const keyword = search.toLowerCase();
                return Object.values(item).some((value) =>
                    String(value ?? '').toLowerCase().includes(keyword)
                );
            }) ?? [];

    const totalSiswa = data?.data?.length ?? 0;
    const totalKelas = new Set(data?.data?.map((s) => s.kelas?.kodeKelas).filter(Boolean)).size;

    const columns = [
        { key: 'no', label: 'No' },
        {
            key: 'namaSiswa',
            label: 'Nama Siswa',
            render: (row) => (
                <span className='font-medium text-gray-800'>{row.namaSiswa || '-'}</span>
            ),
        },
        {
            key: 'tanggalLahir',
            label: 'Tanggal Lahir',
            render: (row) => (
                <span className='text-sm text-gray-500'>{row.tanggalLahir?.split('T')[0] || '-'}</span>
            ),
        },
        {
            key: 'kelas',
            label: 'Kelas',
            render: (row) => (
                <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700'>
                    {row.kelas ? `${row.kelas.kodeKelas} · ${row.kelas.namaKelas}` : '-'}
                </span>
            ),
        },
        {
            key: 'aksi',
            label: 'Aksi',
            render: (row) => (
                <div className='flex gap-2'>
                    <button
                        onClick={() => handleEdit(row)}
                        className='inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors font-medium'
                    >
                        ✏️ Edit
                    </button>
                    <button
                        onClick={() => handleRemove(row)}
                        className='inline-flex items-center gap-1 text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium'
                    >
                        🗑️ Hapus
                    </button>
                </div>
            ),
        },
    ];

    const handleExport = () => exportToExcel(tableData, []);

    return (
        <>
            <div className='min-h-screen bg-gray-50 p-6'>
                <div className='mx-auto max-w-7xl'>

                    {/* Header */}
                    <div className='mb-5'>
                        <h1 className='text-xl font-medium text-gray-900'>Data Siswa</h1>
                        <p className='text-sm text-gray-400 mt-0.5'>Seluruh data siswa terdaftar</p>
                    </div>

                    {/* Stat Cards */}
                    <div className='grid grid-cols-2 gap-3 mb-5'>
                        <div className='bg-white rounded-xl border border-gray-100 px-4 py-3'>
                            <p className='text-xs text-gray-400 mb-1'>Total Siswa</p>
                            <p className='text-2xl font-medium text-gray-800'>{totalSiswa}</p>
                        </div>
                        <div className='bg-white rounded-xl border border-gray-100 px-4 py-3'>
                            <p className='text-xs text-gray-400 mb-1'>Total Kelas</p>
                            <p className='text-2xl font-medium text-gray-800'>{totalKelas}</p>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'>

                        {/* Toolbar */}
                        <div className='flex items-center justify-between gap-3 mb-4 flex-wrap'>
                            {/* Search */}
                            <div className='relative w-full md:w-72'>
                                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm'>🔍</span>
                                <input
                                    type='text'
                                    placeholder='Cari nama, kelas, atau data siswa...'
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className='w-full pl-8 pr-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all'
                                />
                            </div>

                            {/* Buttons */}
                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={handleExport}
                                    className='inline-flex items-center gap-1.5 text-sm text-white bg-green-500 px-3.5 py-2 rounded-lg hover:bg-green-600 transition-colors'
                                >
                                    📤 Export
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        {isLoading && (
                            <p className='text-center text-gray-400 py-12 text-sm'>Memuat data...</p>
                        )}
                        {isError && (
                            <p className='text-center text-red-400 py-12 text-sm'>Gagal memuat data</p>
                        )}
                        {!isLoading && !isError && <Table columns={columns} data={tableData} />}

                        {/* Footer */}
                        {!isLoading && !isError && (
                            <div className='mt-4 pt-4 border-t border-gray-100'>
                                <p className='text-xs text-gray-400'>
                                    Menampilkan {tableData.length} dari {totalSiswa} siswa
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showCreateModal && (
                <CreateModal
                    onCancel={() => setShowCreateModal(false)}
                    icon={<FaUserPlus />}
                    title='Tambah Siswa'
                    formTambah={FormTambahSiswa}
                    successTitle='Siswa Berhasil Dibuat'
                    successMessage='Berhasil'
                />
            )}
            {showEditModal && (
                <EditModal
                    onCancel={() => setShowEditModal(false)}
                    icon={<FaUserPlus />}
                    title='Edit Siswa'
                    formEdit={FormEditDataSiswa}
                    initialData={selectedSiswa}
                    successTitle='Siswa Berhasil di Update'
                    successMessage='Berhasil'
                />
            )}
            {showRemoveModal && (
                <RemoveModal
                    onCancel={() => setShowRemoveModal(false)}
                    icon={<FaUserPlus />}
                    title='Hapus Siswa'
                    initialData={removeSiswa}
                    displayName='namaSiswa'
                    onConfirm={handleDelete}
                    successTitle='Siswa Berhasil di Hapus'
                    successMessage='Berhasil'
                />
            )}
        </>
    );
}