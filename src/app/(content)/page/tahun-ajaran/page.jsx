'use client';

import {
    useSeeAllTahunAjaranQuery,
    useRemoveTahunAjaranMutation,
} from '../../../../hooks/api/tahunAjaranSliceAPI';

import FormTambahTahunAjaran from '../../../conponents/form/crud/tambah-data/tahunAjaran';
import CreateModal from '../../../conponents/modal/crud/createModal';
import { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import EditModal from '../../../conponents/modal/crud/editModal';
import RemoveModal from '../../../conponents/modal/crud/deleteModal';
import FormEditDataTahunAjaran from '../../../conponents/form/crud/edit-data/tahunAjaran';
import Table from '../../../conponents/table/page';

export default function TahunAjaran() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    const [selectedTahunAjaran, setSelectedTahunAjaran] = useState(null);
    const handleEdit = (tahunAjaran) => {
        setSelectedTahunAjaran(tahunAjaran);
        setShowEditModal(true);
    };

    const [deleteTahunAjaran] = useRemoveTahunAjaranMutation();
    const [removeTahunAjaran, setRemoveTahunAjaran] = useState(null);
    const handleRemove = (tahunAjaran) => {
        setRemoveTahunAjaran(tahunAjaran);
        setShowRemoveModal(true);
    };

    const { data, isLoading, isError } = useSeeAllTahunAjaranQuery();

    const tahunAjaranData =
        data?.data?.map((item, index) => ({ no: index + 1, ...item })) ?? [];

    const totalAktif = data?.data?.filter((item) => item.status === 'Aktif').length ?? 0;
    const totalTahun = data?.data?.length ?? 0;

    const columns = [
        { key: 'no', label: 'No' },
        {
            key: 'namaTahunAjaran',
            label: 'Tahun Ajaran',
            render: (row) => (
                <span className='font-medium text-gray-800'>{row.namaTahunAjaran || '-'}</span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.status === 'Aktif'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                    }`}
                >
                    {row.status === 'Aktif' ? '● Aktif' : '○ Tidak Aktif'}
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

    return (
        <>
            <div className='min-h-screen bg-gray-50 p-6'>
                <div className='mx-auto max-w-7xl'>

                    {/* Header */}
                    <div className='mb-5'>
                        <h1 className='text-xl font-medium text-gray-900'>Data Tahun Ajaran</h1>
                        <p className='text-sm text-gray-400 mt-0.5'>Kelola tahun ajaran aktif dan nonaktif</p>
                    </div>

                    {/* Stat Cards */}
                    <div className='grid grid-cols-2 gap-3 mb-5'>
                        <div className='bg-white rounded-xl border border-gray-100 px-4 py-3'>
                            <p className='text-xs text-gray-400 mb-1'>Total Tahun Ajaran</p>
                            <p className='text-2xl font-medium text-gray-800'>{totalTahun}</p>
                        </div>
                        <div className='bg-white rounded-xl border border-gray-100 px-4 py-3'>
                            <p className='text-xs text-gray-400 mb-1'>Tahun Ajaran Aktif</p>
                            <p className='text-2xl font-medium text-green-600'>{totalAktif}</p>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'>

                        {/* Toolbar */}
                        <div className='flex items-center justify-between mb-4'>
                            <p className='text-sm text-gray-500'>Daftar tahun ajaran terdaftar</p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className='inline-flex items-center gap-1.5 text-sm text-white bg-blue-500 px-3.5 py-2 rounded-lg hover:bg-blue-600 transition-colors'
                            >
                                + Tambah Tahun Ajaran
                            </button>
                        </div>

                        {/* Table */}
                        {isLoading && (
                            <p className='text-center text-gray-400 py-12 text-sm'>Memuat data...</p>
                        )}
                        {isError && (
                            <p className='text-center text-red-400 py-12 text-sm'>Gagal memuat data</p>
                        )}
                        {!isLoading && !isError && <Table columns={columns} data={tahunAjaranData} />}

                        {/* Footer */}
                        {!isLoading && !isError && (
                            <div className='mt-4 pt-4 border-t border-gray-100'>
                                <p className='text-xs text-gray-400'>
                                    {totalTahun} tahun ajaran terdaftar · {totalAktif} aktif
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
                    title='Tambah Tahun Ajaran'
                    formTambah={FormTambahTahunAjaran}
                    successTitle='Tahun Ajaran Berhasil Ditambahkan'
                    successMessage='Berhasil'
                />
            )}
            {showEditModal && (
                <EditModal
                    onCancel={() => setShowEditModal(false)}
                    icon={<FaUserPlus />}
                    title='Edit Tahun Ajaran'
                    formEdit={FormEditDataTahunAjaran}
                    initialData={selectedTahunAjaran}
                    successTitle='Tahun Ajaran Berhasil Diubah'
                    successMessage='Berhasil'
                />
            )}
            {showRemoveModal && (
                <RemoveModal
                    onCancel={() => setShowRemoveModal(false)}
                    icon={<FaUserPlus />}
                    initialData={removeTahunAjaran}
                    title='Hapus Tahun Ajaran'
                    displayName='namaTahunAjaran'
                    onConfirm={() => deleteTahunAjaran(removeTahunAjaran.id)}
                    successTitle='Tahun Ajaran Berhasil Dihapus'
                    successMessage='Berhasil'
                />
            )}
        </>
    );
}