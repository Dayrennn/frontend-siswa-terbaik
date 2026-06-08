'use client';

import {
    useSeeAllJadwalByKelasAndTahunAjaranQuery,
    useRemoveJadwalMutation,
} from '../../../../hooks/api/jadwalSliceAPI';
import JadwalCard from '../../../conponents/card/jadwalCard';
import CreateModal from '../../../conponents/modal/crud/createModal';
import EditModal from '../../../conponents/modal/crud/editModal';
import RemoveModal from '../../../conponents/modal/crud/deleteModal';
import FormTambahJadwal from '../../../conponents/form/crud/tambah-data/jadwal';
import KelasSearchDropdown from '../../../conponents/ui/kelasSearchDropdown';
import { FaUserPlus } from 'react-icons/fa';
import { useState } from 'react';
import FormEditDataPelajaran from '../../../conponents/form/crud/edit-data/pelajaran';

export default function DataJadwal() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    // filter
    const [kelasId, setKelasId] = useState('');

    const [deleteJadwal] = useRemoveJadwalMutation();
    const [removeItem, setRemoveItem] = useState(null);
    const handleRemove = (jadwal) => {
        setRemoveItem(jadwal);
        setShowRemoveModal(true);
    };
    const handleDelete = async () => {
        await deleteJadwal(removeItem.id).unwrap();
        setShowRemoveModal(false);
    };

    const [selectedPelajaran, setSelectedPelajaran] = useState(null);
    const handleEdit = (pelajaran) => {
        setSelectedPelajaran(pelajaran);
        setShowEditModal(true);
    };

    const {
        data: jadwalData,
        isLoading,
        isError,
    } = useSeeAllJadwalByKelasAndTahunAjaranQuery({ kelasId }, { skip: !kelasId });
    const jadwalList = jadwalData?.data ?? [];

    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <div className="mx-auto max-w-7xl bg-white p-6 shadow-md rounded-xl">
                    <h1 className="text-2xl font-bold text-gray-800">Data Jadwal</h1>

                    <div className="flex gap-3 mt-5 mb-3 items-end">
                        <div className="flex-1">
                            <label className="text-sm text-gray-600">Kelas</label>
                            <KelasSearchDropdown value={kelasId} onChange={setKelasId} />
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            + Tambah
                        </button>
                    </div>

                    {!kelasId ? (
                        <p className="text-center text-gray-400 py-8">Pilih kelas terlebih dahulu</p>
                    ) : isLoading ? (
                        <p className="text-center text-gray-400 py-8">Memuat Data...</p>
                    ) : isError ? (
                        <p className="text-center text-red-400 py-8">Gagal Memuat Data</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {jadwalList.length === 0 ? (
                                <p className="text-gray-400 text-sm col-span-full text-center py-8">Belum ada jadwal</p>
                            ) : (
                                jadwalList.map((jadwal) => (
                                    <a key={jadwal.id} href={`/page/jadwal/${jadwal.id}`}>
                                        <JadwalCard
                                            key={jadwal.id}
                                            jadwal={jadwal}
                                            onEdit={handleEdit}
                                            onRemove={handleRemove}
                                        />
                                    </a>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* modal tetap sama */}
            {showCreateModal && (
                <CreateModal
                    onCancel={() => setShowCreateModal(false)}
                    icon={<FaUserPlus />}
                    title="Tambah Jadwal"
                    formTambah={FormTambahJadwal}
                    successTitle="Jadwal Berhasil Dibuat"
                    successMessage="Berhasil"
                />
            )}
            {showEditModal && (
                <EditModal
                    onCancel={() => setShowEditModal(false)}
                    icon={<FaUserPlus />}
                    title="Edit Pelajaran"
                    formEdit={FormEditDataPelajaran}
                    initialData={selectedPelajaran}
                    successTitle="Pelajaran Berhasil di Update"
                    successMessage="Berhasil"
                />
            )}
            {showRemoveModal && (
                <RemoveModal
                    onCancel={() => setShowRemoveModal(false)}
                    icon={<FaUserPlus />}
                    title="Hapus Pelajaran"
                    initialData={removeItem}
                    displayName="Jadwal"
                    onConfirm={handleDelete}
                    successTitle="Jadwal Berhasil di Hapus"
                    successMessage="Berhasil"
                />
            )}
        </>
    );
}
