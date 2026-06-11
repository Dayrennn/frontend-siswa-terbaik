'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { siswaAPI, useGetSiswaByIdQuery } from '@/src/hooks/api/siswaSliceAPI';
import { useRemovePoinPlusMutation } from '@/src/hooks/api/poinPlusSliceAPI';
import { useRemovePoinMinusMutation } from '@/src/hooks/api/poinMinusSliceAPI';
import EditModal from '@/src/app/conponents/modal/crud/editModal';
import RemoveModal from '@/src/app/conponents/modal/crud/deleteModal';
import { FaUserPlus } from 'react-icons/fa';
import FormEditPoinPlus from '@/src/app/conponents/form/crud/edit-data/poinPlus';
import FormEditPoinMinus from '@/src/app/conponents/form/crud/edit-data/poinMinus';
import { useDispatch } from 'react-redux';

function formatTanggal(iso) {
    if (!iso) return '-';
    return new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function getInitials(nama) {
    return (
        nama
            ?.split(' ')
            .slice(0, 2)
            .map((w) => w[0])
            .join('')
            .toUpperCase() ?? '?'
    );
}

export default function SemuaPoin() {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('plus');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { siswaId } = useParams();
    const { data, isLoading, isError } = useGetSiswaByIdQuery(siswaId);

    const SISWA = data?.data ?? null;
    const poinPlus = SISWA?.poinPlus ?? [];
    const poinMinus = SISWA?.poinMinus ?? [];

    const totalPlus = SISWA?.totalPoinPlus ?? 0;
    const totalMinus = SISWA?.totalPoinMinus ?? 0;

    const list = activeTab === 'plus' ? poinPlus : poinMinus;

    const [selectedPoin, setSelectedPoin] = useState(null);
    const handleEdit = (poin) => {
        setSelectedPoin(poin);
        setShowEditModal(true);
    };

    const [deletePoinPlus] = useRemovePoinPlusMutation();
    const [deletePoinMinus] = useRemovePoinMinusMutation();
    const [removePoin, setRemovePoin] = useState(null);

    const handleConfirmDelete = async () => {
        try {
            if (activeTab === 'plus') {
                await deletePoinPlus(removePoin.id).unwrap();
            } else {
                await deletePoinMinus(removePoin.id).unwrap();
            }
            dispatch(siswaAPI.util.invalidateTags(['siswaAPI']));
            setShowDeleteModal(false);
            setRemovePoin(null);
        } catch (err) {
            console.error('ERROR', err);
        }
    };

    const handleDelete = (poin) => {
        setRemovePoin(poin);
        setShowDeleteModal(true);
    };

    if (isLoading) return <p className="text-center text-gray-400 py-12 text-sm">Memuat data...</p>;
    if (isError || !SISWA) return <p className="text-center text-red-400 py-12 text-sm">Gagal memuat data</p>;
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-2xl">
                {/* Back */}
                <Link
                    href="/page/data-pelanggaran"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-5 transition-colors"
                >
                    ← Kembali
                </Link>

                {/* Header siswa */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {getInitials(SISWA.namaSiswa)}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">{SISWA.namaSiswa}</p>
                            <p className="text-xs text-gray-400">
                                NIS: {SISWA.nis} · {SISWA.kelas.kodeKelas} {SISWA.kelas.namaKelas}
                            </p>
                        </div>
                    </div>

                    {/* Ringkasan */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-green-50 rounded-xl px-4 py-3">
                            <p className="text-xs text-green-600 mb-1">Total Poin Plus</p>
                            <p className="text-2xl font-semibold text-green-700">+{totalPlus}</p>
                            <p className="text-xs text-green-500 mt-0.5">{poinPlus.length} catatan</p>
                        </div>
                        <div className="bg-red-50 rounded-xl px-4 py-3">
                            <p className="text-xs text-red-600 mb-1">Total Poin Minus</p>
                            <p className="text-2xl font-semibold text-red-700">-{totalMinus}</p>
                            <p className="text-xs text-red-400 mt-0.5">{poinMinus.length} catatan</p>
                        </div>
                    </div>
                </div>

                {/* Tabel poin */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Tab */}
                    <div className="flex border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab('plus')}
                            className={`flex-1 py-3.5 text-sm font-medium transition-colors border-b-2 ${
                                activeTab === 'plus'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            Poin Plus ({poinPlus.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('minus')}
                            className={`flex-1 py-3.5 text-sm font-medium transition-colors border-b-2 ${
                                activeTab === 'minus'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            Poin Minus ({poinMinus.length})
                        </button>
                    </div>

                    {/* List */}
                    {list.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-12">Belum ada data</p>
                    ) : (
                        <div>
                            {/* Table head */}
                            <div className="grid grid-cols-12 px-5 py-2.5 border-b border-gray-50 text-xs text-gray-400 font-medium">
                                <span className="col-span-1">No</span>
                                <span className="col-span-4">Deskripsi</span>
                                <span className="col-span-2 text-center">Poin</span>
                                <span className="col-span-2 text-center">Tanggal</span>
                                <span className="col-span-3 text-center">Aksi</span>
                            </div>

                            {/* Rows */}
                            {list.map((p, i) => (
                                <div
                                    key={p.id}
                                    className="grid grid-cols-12 px-5 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors items-center"
                                >
                                    <span className="col-span-1 text-xs text-gray-400">{i + 1}</span>
                                    <span className="col-span-4 text-sm text-gray-800">{p.deskripsi}</span>
                                    <span className="col-span-2 text-center">
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                activeTab === 'plus'
                                                    ? 'bg-green-50 text-green-700'
                                                    : 'bg-red-50 text-red-700'
                                            }`}
                                        >
                                            {activeTab === 'plus' ? '+' : '-'}
                                            {p.poin}
                                        </span>
                                    </span>
                                    <span className="col-span-2 text-center text-xs text-gray-400">
                                        {formatTanggal(p.tanggal)}
                                    </span>
                                    <span className="col-span-3 flex items-center justify-end gap-1.5">
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="text-xs bg-amber-50 text-amber-600 px-2.5 py-1 rounded-lg hover:bg-amber-100 transition-colors font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p)}
                                            className="text-xs bg-red-50 text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-100 transition-colors font-medium"
                                        >
                                            Hapus
                                        </button>
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {showEditModal && (
                <EditModal
                    onCancel={() => setShowEditModal(false)}
                    icon={<FaUserPlus />}
                    title="Edit Poin"
                    formEdit={activeTab === 'plus' ? FormEditPoinPlus : FormEditPoinMinus}
                    initialData={selectedPoin}
                    successTitle="Poin Berhasil Dirubah"
                    successMessage="Berhasil"
                />
            )}
            {showDeleteModal && (
                <RemoveModal
                    onCancel={() => setShowDeleteModal(false)}
                    icon={<FaUserPlus />}
                    title="Hapus Data"
                    successTitle="Poin Berhasil Dihapus"
                    successMessage="Berhasil"
                    initialData={removePoin}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
}
