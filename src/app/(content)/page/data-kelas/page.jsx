'use client';

import CreateModal from '../../../conponents/modal/crud/createModal';
import EditModal from '../../../conponents/modal/crud/editModal';
import RemoveModal from '../../../conponents/modal/crud/deleteModal';
import Table from '../../../conponents/table/page';
import Link from 'next/link';

import { useGetAllKelasQuery, useRemoveKelasMutation } from '../../../../hooks/api/kelasSliceAPI';
import { useState } from 'react';

import { FaUserPlus } from 'react-icons/fa';
import FormTambahDataKelas from '../../../conponents/form/crud/tambah-data/kelas';
import FormEditDataKelas from '../../../conponents/form/crud/edit-data/kelas';

export default function DataKelas() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    const [selectedKelas, setSelectedKelas] = useState(null);
    const handleEdit = (kelas) => {
        setSelectedKelas(kelas);
        setShowEditModal(true);
    };

    const [deleteKelas] = useRemoveKelasMutation();
    const [removeKelas, setRemoveKelas] = useState(null);
    const handleRemove = (kelas) => {
        setRemoveKelas(kelas);
        setShowRemoveModal(true);
    };

    const columns = [
        { key: 'no', label: 'No' },
        {
            key: 'kodeKelas',
            label: 'Kode Kelas',
            render: (row) => <span className='text-gray-700'>{row.kodeKelas || '-'}</span>,
        },
        {
            key: 'namaKelas',
            label: 'Nama Kelas',
            render: (row) => <span className='text-gray-700'>{row.namaKelas || '-'}</span>,
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
                    <Link href={`page/data-siswa/${row.id}`}>
                        <button className='text-xs bg-blue-100 text-blue-500 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors'>
                            Lihat
                        </button>
                    </Link>
                </div>
            ),
        },
    ];

    // ambil data
    const { data, isLoading, isError } = useGetAllKelasQuery();
    const kelasData =
        data?.data?.map((item, index) => {
            return {
                no: index + 1,
                ...item,
            };
        }) ?? [];

    return (
        <>
            <div className='min-h-screen bg-gray-100'>
                <div className='mx-auto max-w-7xl bg-white p-6 shadow-md rounded-xl'>
                    <div className='flex items-center justify-between mb-6'>
                        <h1 className='text-2xl font-bold text-gray-800'>Data Kelas</h1>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow'
                        >
                            + Tambah Kelas
                        </button>
                    </div>

                    <div className='flex justify-between items-center mt-4 mb-4'>
                        <p className='text-gray-600 text-sm'>Pilih kelas</p>
                    </div>

                    <div className='mt-5 mb-3'>
                        {isLoading && (
                            <p className='text-center text-gray-400 py-8'>Memuat Data...</p>
                        )}

                        {isError && (
                            <p className='text-center text-red-400 py-8'>Gagal Memuat Data</p>
                        )}

                        {!isLoading && !isError && <Table columns={columns} data={kelasData} />}
                    </div>
                </div>
            </div>
            {showCreateModal && (
                <CreateModal
                    onCancel={() => setShowCreateModal(false)}
                    icon={<FaUserPlus />}
                    title='Tambah Data Kelas'
                    formTambah={FormTambahDataKelas}
                    successTitle='Data Kelas Berhasil Ditambahkan'
                    successMessage='Berhasil'
                />
            )}
            {showEditModal && (
                <EditModal
                    onCancel={() => setShowEditModal(false)}
                    icon={<FaUserPlus />}
                    title='Edit Data Kelas'
                    formEdit={FormEditDataKelas}
                    initialData={selectedKelas}
                    successTitle='Data Kelas Berhasil Diubah'
                    successMessage='Berhasil'
                />
            )}
            {showRemoveModal && (
                <RemoveModal
                    onCancel={() => setShowRemoveModal(false)}
                    icon={<FaUserPlus />}
                    initialData={removeKelas}
                    title='Hapus Data Kelas'
                    displayName='namaTahunAjaran'
                    onConfirm={() => deleteKelas(removeKelas.id)}
                    successTitle='Data Kelas Berhasil Dihapus'
                    successMessage='Berhasil'
                />
            )}
        </>
    );
}
