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
    //modal
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [search, setSearch] = useState('');

    // hapus pelajaran
    const [deleteSiswa] = useRemoveSiswaMutation();
    const [removeSiswa, setRemoveSiswa] = useState(null);

    const handleRemove = (siswa) => {
        setRemoveSiswa(siswa);
        setShowRemoveModal(true);
    };

    // hit api delete
    const handleDelete = async (id) => {
        await deleteSiswa(id).unwrap();
    };

    // edit siswa
    const [selectedSiswa, setSelectedSiswa] = useState(null);
    const handleEdit = (siswa) => {
        setSelectedSiswa(siswa);
        setShowEditModal(true);
    };

    // ambil data
    const { data, isLoading, isError } = useSeeAllSiswaQuery();
    const tableData =
        data?.data
            ?.map((siswa, index) => ({
                no: index + 1,
                ...siswa,
            }))
            .filter((item) => {
                const keyword = search.toLowerCase();

                return Object.values(item).some((value) =>
                    String(value ?? '')
                        .toLowerCase()
                        .includes(keyword),
                );
            }) ?? [];

    const columns = [
        { key: 'no', label: 'No' },
        {
            key: 'namaSiswa',
            label: 'Nama Siswa',
            render: (row) => <span className='text-gray-700'>{row.namaSiswa || '-'}</span>,
        },
        {
            key: 'tanggalLahir',
            label: 'Tanggal Lahir',
            render: (row) => (
                <span className='text-gray-700'>{row.tanggalLahir?.split('T')[0] || '-'}</span>
            ),
        },
        {
            key: 'kelas',
            label: 'Kelas',
            render: (row) => (
                <span className='text-gray-700'>
                    {row.kelas ? `${row.kelas.kodeKelas} - ${row.kelas.namaKelas}` : '-'}
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

    const handleExport = () => {
        exportToExcel(tableData, pelajaranList);
    };
    
    return (
        <>
            <div className='min-h-screen bg-gray-100'>
                <div className='mx-auto max-w-7xl bg-white p-6 shadow-md rounded-xl'>
                    <h1 className='text-2xl font-bold text-gray-800'>Data Siswa</h1>

                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-5 mb-4'>
                        {/* SEARCH */}
                        <div className='relative w-full md:w-80'>
                            <input
                                type='text'
                                placeholder='Cari nama, kelas, atau data siswa...'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className='w-full pl-10 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                            />
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={handleExport}
                                className='flex items-center gap-2 text-sm bg-emerald-500 text-white px-4 py-2 rounded-xl
                 shadow-sm hover:bg-emerald-600 active:scale-95 transition-all'
                            >
                                📤 Export
                            </button>
                        </div>
                    </div>

                    {isLoading && <p className='text-center text-gray-400 py-8'>Memuat Data...</p>}

                    {isError && <p className='text-center text-red-400 py-8'>Gagal Memuat Data</p>}

                    {!isLoading && !isError && <Table columns={columns} data={tableData} />}
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
