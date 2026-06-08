'use client';

import {
    useSeeAllSiswaByTahunAjaranQuery,
    useRemoveSiswaMutation,
} from '../../../../../hooks/api/siswaSliceAPI';
import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';

import CreateModal from '../../../../conponents/modal/crud/createModal';
import EditModal from '../../../../conponents/modal/crud/editModal';
import RemoveModal from '../../../../conponents/modal/crud/deleteModal';
import { FaUserPlus } from 'react-icons/fa';
import Table from '../../../../conponents/table/page';
import FormTambahSiswa from '../../../../conponents/form/crud/tambah-data/siswa';
import FormEditDataSiswa from '../../../../conponents/form/crud/edit-data/siswa';
import {
    exportToExcel,
    downloadTemplate,
    parseImportedExcel,
} from '../../../../../hooks/utils/excelHelper';

export default function DataSiswaPerTahun() {
    const { tahunAjaranId } = useParams();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [search, setSearch] = useState('');
    const fileInputRef = useRef();

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

    const { data, isLoading, isError } = useSeeAllSiswaByTahunAjaranQuery(tahunAjaranId);

    const tableData =
        data?.data
            ?.map((siswa, index) => ({
                no: index + 1,
                ...siswa,
            }))
            .filter((item) => item.namaSiswa?.toLowerCase().includes(search.toLowerCase())) ?? [];

    const pelajaranMap = new Map();
    data?.data?.forEach((siswa) => {
        siswa.nilai?.forEach((n) => {
            pelajaranMap.set(n.pelajaran.kodePelajaran, n.pelajaran.namaPelajaran);
        });
    });
    const pelajaranList = Array.from(pelajaranMap.entries()).map(([key, label]) => ({
        key,
        label,
    }));

    const tahunAjaranLabel = data?.data?.[0]?.tahunAjaran?.namaTahunAjaran ?? '';

    const columns = [
        { key: 'no', label: 'No' },
        {
            key: 'nis',
            label: 'NIS',
            render: (row) => (
                <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600'>
                    {row.nis || '-'}
                </span>
            ),
        },
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
                <span className='text-gray-500 text-sm'>{row.tanggalLahir?.split('T')[0] || '-'}</span>
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
            key: 'tahunAjaran',
            label: 'Tahun Ajaran',
            render: (row) => (
                <span className='text-gray-500 text-sm'>
                    {row.tahunAjaran?.namaTahunAjaran || '-'}
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

    const handleExport = () => exportToExcel(tableData, pelajaranList);

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const rows = await parseImportedExcel(file);
        console.log('Data dari Excel:', rows);
        e.target.value = '';
    };

    const totalSiswa = data?.data?.length ?? 0;
    const totalKelas = new Set(data?.data?.map((s) => s.kelas?.kodeKelas).filter(Boolean)).size;

    return (
        <>
            <div className='min-h-screen bg-gray-50 p-6'>
                <div className='mx-auto max-w-7xl'>

                    {/* Header */}
                    <div className='mb-5'>
                        <h1 className='text-xl font-medium text-gray-900'>
                            Data Siswa{' '}
                            <span className='text-gray-400 font-normal'>{tahunAjaranLabel}</span>
                        </h1>
                        <p className='text-sm text-gray-400 mt-0.5'>Manajemen data siswa per tahun ajaran</p>
                    </div>

                    {/* Stat Cards */}
                    <div className='grid grid-cols-3 gap-3 mb-5'>
                        <div className='bg-white rounded-xl border border-gray-100 px-4 py-3'>
                            <p className='text-xs text-gray-400 mb-1'>Total Siswa</p>
                            <p className='text-2xl font-medium text-gray-800'>{totalSiswa}</p>
                        </div>
                        <div className='bg-white rounded-xl border border-gray-100 px-4 py-3'>
                            <p className='text-xs text-gray-400 mb-1'>Total Kelas</p>
                            <p className='text-2xl font-medium text-gray-800'>{totalKelas}</p>
                        </div>
                        <div className='bg-white rounded-xl border border-gray-100 px-4 py-3'>
                            <p className='text-xs text-gray-400 mb-1'>Tahun Ajaran</p>
                            <p className='text-base font-medium text-gray-800 mt-1'>{tahunAjaranLabel || '-'}</p>
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
                                    placeholder='Cari nama siswa...'
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className='w-full pl-8 pr-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all'
                                />
                            </div>

                            {/* Buttons */}
                            <div className='flex items-center gap-2 flex-wrap'>
                                <button
                                    onClick={downloadTemplate}
                                    className='inline-flex items-center gap-1.5 text-sm text-gray-600 bg-white border border-gray-200 px-3.5 py-2 rounded-lg hover:bg-gray-50 transition-colors'
                                >
                                    📄 Template
                                </button>

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className='inline-flex items-center gap-1.5 text-sm text-white bg-teal-500 px-3.5 py-2 rounded-lg hover:bg-teal-600 transition-colors'
                                >
                                    📥 Import
                                </button>

                                <input
                                    ref={fileInputRef}
                                    type='file'
                                    accept='.xlsx, .xls'
                                    className='hidden'
                                    onChange={handleImport}
                                />

                                <button
                                    onClick={handleExport}
                                    className='inline-flex items-center gap-1.5 text-sm text-white bg-green-500 px-3.5 py-2 rounded-lg hover:bg-green-600 transition-colors'
                                >
                                    📤 Export
                                </button>

                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className='inline-flex items-center gap-1.5 text-sm text-white bg-blue-500 px-3.5 py-2 rounded-lg hover:bg-blue-600 transition-colors'
                                >
                                    + Tambah Siswa
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
                            <div className='mt-4 pt-4 border-t border-gray-100 flex items-center justify-between'>
                                <p className='text-xs text-gray-400'>
                                    Menampilkan {tableData.length} dari {data?.data?.length ?? 0} siswa
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