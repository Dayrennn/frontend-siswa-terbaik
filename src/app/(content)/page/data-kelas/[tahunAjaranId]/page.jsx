'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Table from '../../../../conponents/table/page';
import Link from 'next/link';
import {
    useGetKelasByTahunAjaranQuery,
    useRemoveKelasMutation,
    useModifyKelasMutation,
} from '../../../../../hooks/api/kelasSliceAPI';
import { useGetTahunAjaranByIdQuery } from '../../../../../hooks/api/tahunAjaranSliceAPI';
import CreateModal from '@/src/app/conponents/modal/crud/createModal';
import RemoveModal from '@/src/app/conponents/modal/crud/deleteModal';
import EditModal from '@/src/app/conponents/modal/crud/editModal';
import { FaUserPlus } from 'react-icons/fa';
import FormTambahDataKelas from '@/src/app/conponents/form/crud/tambah-data/kelas';
import { selectUser } from '@/src/hooks/api/authSliceAPI';
import { useSelector } from 'react-redux';
import FormEditDataKelas from '@/src/app/conponents/form/crud/edit-data/kelas';

export default function DataKehadiranByTahunAjaran() {
    const { tahunAjaranId } = useParams();

    const user = useSelector(selectUser);
    const isAdmin = user?.role === 'Admin';
    const isWakilKepalaSekolah = user?.role === 'WakilKepalaSekolah';

    const [selectedId, setSelectedId] = useState(null);

    const [search, setSearch] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const { data, isLoading, isError } = useGetKelasByTahunAjaranQuery(tahunAjaranId);
    const [removeKelas] = useRemoveKelasMutation();
    const { data: tahunAjaranData } = useGetTahunAjaranByIdQuery(tahunAjaranId);

    const namaTahunAjaran = tahunAjaranData?.data?.namaTahunAjaran ?? '';

    const kelasData =
        data?.data
            ?.map((item, index) => ({ no: index + 1, ...item }))
            .filter((item) =>
                [item.kodeKelas, item.namaKelas].join(' ').toLowerCase().includes(search.toLowerCase()),
            ) ?? [];

    const totalKelas = data?.data?.length ?? 0;

    const handleDelete = async () => {
        await removeKelas(selectedId).unwrap();
    };

    const handleEdit = async (siswa) => {
        setShowEditModal(true);
        setSelectedId(siswa);
    };

    const columns = [
        { key: 'no', label: 'No' },
        {
            key: 'kodeKelas',
            label: 'Kode Kelas',
            render: (row) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {row.kodeKelas || '-'}
                </span>
            ),
        },
        {
            key: 'namaKelas',
            label: 'Nama Kelas',
            render: (row) => <span className="font-medium text-gray-800">{row.namaKelas || '-'}</span>,
        },
        {
            key: 'aksi',
            label: 'Aksi',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Link href={`/page/data-kelas/${tahunAjaranId}/${row.id}`}>
                        <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium cursor-pointer">
                            Lihat Data →
                        </span>
                    </Link>
                    {(isAdmin || isWakilKepalaSekolah) && (
                        <button
                            onClick={() => {
                                handleEdit(row);
                            }}
                            className="text-xs bg-red-50 text-yellow-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium"
                        >
                            Edit
                        </button>
                    )}
                    {isAdmin && (
                        <button
                            onClick={() => {
                                setSelectedId(row.id);
                                setShowDeleteModal(true);
                            }}
                            className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium"
                        >
                            Hapus
                        </button>
                    )}
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
                        <h1 className="text-xl font-medium text-gray-900">
                            Data Kelas <span className="text-gray-400 font-normal">{namaTahunAjaran}</span>
                        </h1>
                        <p className="text-sm text-gray-400 mt-0.5">Pilih kelas untuk melihat detail data</p>
                    </div>

                    {/* Stat Card */}
                    <div className="grid grid-cols-1 gap-3 mb-5 max-w-xs">
                        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                            <p className="text-xs text-gray-400 mb-1">Total Kelas</p>
                            <p className="text-2xl font-medium text-gray-800">{totalKelas}</p>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        {/* Toolbar */}
                        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div className="relative w-full md:w-72">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm">
                                    🔍
                                </span>
                                <input
                                    type="text"
                                    placeholder="Cari kode atau nama kelas..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-8 pr-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                                />
                            </div>
                            {(isAdmin || isWakilKepalaSekolah) && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    + Tambah
                                </button>
                            )}
                        </div>

                        {/* Table */}
                        {isLoading && <p className="text-center text-gray-400 py-12 text-sm">Memuat data...</p>}
                        {isError && <p className="text-center text-red-400 py-12 text-sm">Gagal memuat data</p>}
                        {!isLoading && !isError && <Table columns={columns} data={kelasData} />}

                        {/* Footer */}
                        {!isLoading && !isError && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-400">
                                    Menampilkan {kelasData.length} dari {totalKelas} kelas
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
                    title="Tambah Kelas"
                    formTambah={FormTambahDataKelas}
                    successTitle="Kelas Berhasil Di Tambah"
                    successMessage="Berhasil"
                    tahunAjaranId={tahunAjaranId}
                />
            )}
            {showDeleteModal && (
                <RemoveModal
                    onCancel={() => setShowDeleteModal(false)}
                    icon={<FaUserPlus />}
                    title="Hapus Kelas"
                    successTitle="Kelas Berhasil Di Hapus"
                    successMessage="Berhasil"
                    initialData={removeKelas}
                    onConfirm={handleDelete}
                />
            )}
            {showEditModal && (
                <EditModal
                    onCancel={() => setShowEditModal(false)}
                    title="Edit Kelas"
                    formEdit={FormEditDataKelas}
                    initialData={selectedId}
                    successTitle="Kelas Berhasil di Edit"
                    successMessage="Message"
                />
            )}
        </>
    );
}
