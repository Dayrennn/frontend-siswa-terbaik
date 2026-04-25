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

    // edit tahun ajaran
    const [selectedTahunAjaran, setSelectedTahunAjaran] = useState(null);
    const handleEdit = (tahunAjaran) => {
        setSelectedTahunAjaran(tahunAjaran);
        setShowEditModal(true);
    };

    // hapus tahun ajaran
    const [deleteTahunAjaran] = useRemoveTahunAjaranMutation();
    const [removeTahunAjaran, setRemoveTahunAjaran] = useState(null);
    const handleRemove = (tahunAjaran) => {
        setRemoveTahunAjaran(tahunAjaran);
        setShowRemoveModal(true);
    };

    // ambil data
    const { data, isLoading, isError } = useSeeAllTahunAjaranQuery();

    const tahunAjaranData =
        data?.data?.map((item, index) => {
            return {
                no: index + 1,
                ...item,
            };
        }) ?? [];

    const columns = [
        { key: 'no', label: 'No' },
        {
            key: 'namaTahunAjaran',
            label: 'Tahun Ajaran',
            render: (row) => <span className='text-gray-700'>{row.namaTahunAjaran || '-'}</span>,
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                        row.status === 'Aktif'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-red-100 text-red-600'
                    }`}
                >
                    {row.status || '-'}
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
                        className='text-xs bg-yellow-100 text-yellow-600 px-3 py-1 rounded-lg hover:bg-yellow-200 transition-colors'
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleRemove(row)}
                        className='text-xs bg-red-100 text-red-500 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors'
                    >
                        Hapus
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className='min-h-screen bg-gray-100 px-4 py-6'>
                <div className='mx-auto max-w-7xl bg-white p-6 shadow-md rounded-xl'>
                    {/* Header */}
                    <div className='flex items-center justify-between mb-6'>
                        <h1 className='text-2xl font-bold text-gray-800'>Data Tahun Ajaran</h1>

                        <button
                            onClick={() => setShowCreateModal(true)}
                            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow'
                        >
                            + Tambah Tahun
                        </button>
                    </div>

                    {/* Grid Card */}
                    {isLoading && <p className='text-center text-gray-400 py-8'>Memuat Data...</p>}

                    {isError && <p className='text-center text-red-400 py-8'>Gagal Memuat Data</p>}

                    {!isLoading && !isError && <Table columns={columns} data={tahunAjaranData} />}
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
