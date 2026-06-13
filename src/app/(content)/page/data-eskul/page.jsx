'use client';

import { useState } from 'react';
import RemoveModal from '@/src/app/conponents/modal/crud/deleteModal';
import EditModal from '@/src/app/conponents/modal/crud/editModal';
import CreateModal from '@/src/app/conponents/modal/crud/createModal';

import {
    useSeeAllEskulQuery,
    useCreateEskulMutation,
    useModifyEskulMutation,
    useRemoveEskulMutation,
} from '@/src/hooks/api/eskulSliceAPI';
import { FaUserPlus } from 'react-icons/fa';
import FormEditDataEskul from '@/src/app/conponents/form/crud/edit-data/eskul';
import FormTambahEskul from '@/src/app/conponents/form/crud/tambah-data/eskul';

export default function DataEskul() {
    const [search, setSearch] = useState('');
    const [showModalTambah, setShowModalTambah] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [selectedEskul, setSelectedEskul] = useState(null);
    const [formNama, setFormNama] = useState('');
    const [deleteEskulTarget, setDeleteEskulTarget] = useState(null);

    const { data, isLoading, isError } = useSeeAllEskulQuery();
    const [addEskul, { isLoading: addLoading }] = useCreateEskulMutation();
    const [updateEskul, { isLoading: updateLoading }] = useModifyEskulMutation();
    const [deleteEskul] = useRemoveEskulMutation();

    const eskulList = data?.data ?? [];
    const filtered = eskulList.filter((e) => e.namaEskul.toLowerCase().includes(search.toLowerCase()));
    const formLoading = addLoading || updateLoading;

    const handleAdd = () => {
        setShowModalTambah(true);
        setFormNama('');
        setSelectedEskul(null);
    };

    const handleEdit = (item) => {
        setShowModalEdit(true);
        setSelectedEskul(item);
    };

    const handleRemove = async (eskul) => {
        setShowModalDelete(true);
        setDeleteEskulTarget(eskul);
    };

    const handleDelete = async (id) => {
        await deleteEskul(id).unwrap();
        setShowModalDelete(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Data Ekstrakulikuler</h1>
                <p className="text-sm text-gray-500 mt-1">Kelola data eskul sekolah</p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <input
                    type="text"
                    placeholder="Cari eskul..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Eskul
                </button>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : isError ? (
                <div className="text-center py-20 text-red-500 text-sm">{error}</div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-gray-300 mb-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-16 h-16 mx-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <p className="text-gray-400 text-sm">
                        {search ? `Eskul "${search}" tidak ditemukan` : 'Belum ada data eskul'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-5 py-3 text-gray-500 font-medium w-10">No</th>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium">Nama Eskul</th>
                                <th className="text-left px-5 py-3 text-gray-500 font-medium w-32">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((item, i) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-5 py-3.5 text-gray-400">{i + 1}</td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-700 font-medium">{item.namaEskul}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleRemove(item)}
                                                className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
                        Total {filtered.length} eskul
                    </div>
                </div>
            )}
            {showModalTambah && (
                <CreateModal
                    onCancel={() => setShowModalTambah(false)}
                    icon={<FaUserPlus />}
                    title="Tambah Eskul"
                    formTambah={FormTambahEskul}
                    successTitle="Eskul Berhasil Dibuat"
                    successMessage="Eskul Telah Ditambahkan"
                />
            )}
            {showModalEdit && (
                <EditModal
                    onCancel={() => setShowModalEdit(false)}
                    icon={<FaUserPlus />}
                    title="Eskul User"
                    formEdit={FormEditDataEskul}
                    initialData={selectedEskul}
                    successTitle="Eskul Berhasil di Update"
                    successMessage="Eskul telah di update"
                />
            )}
            {showModalDelete && (
                <RemoveModal
                    onCancel={() => setShowModalDelete(false)}
                    icon={<FaUserPlus />}
                    title="Hapus Eskul"
                    initialData={deleteEskulTarget}
                    onConfirm={handleDelete}
                    displayName="namaEskul"
                    successTitle="Eskul Berhasil di Update"
                    successMessage="Eskul telah di update"
                />
            )}
        </div>
    );
}
