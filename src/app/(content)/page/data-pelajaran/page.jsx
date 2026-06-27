'use client';

import { useRemovePelajaranMutation, useSeeAllPelajaranQuery } from '../../../../hooks/api/pelajaranSliceAPI';
import CreateModal from '../../../conponents/modal/crud/createModal';
import EditModal from '../../../conponents/modal/crud/editModal';
import RemoveModal from '../../../conponents/modal/crud/deleteModal';
import FormTambahPelajaran from '../../../conponents/form/crud/tambah-data/pelajaran';
import { FaUserPlus } from 'react-icons/fa';
import { useState, useMemo } from 'react';
import FormEditDataPelajaran from '../../../conponents/form/crud/edit-data/pelajaran';
import SkeletonCard from '@/src/app/conponents/loading/skeleton/skeletonCard';
import PelajaranCard from '@/src/app/conponents/card/pelajaranCard';
import { selectUser } from '@/src/hooks/api/authSliceAPI';
import { useSelector } from 'react-redux';

export default function DataPelajaran() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [search, setSearch] = useState('');

    const user = useSelector(selectUser);
    const isAdmin = user?.role === 'Admin';
    const isWakilKepalaSekolah = user?.role === 'WakilKepalaSekolah'

    // hapus
    const [deletePelajaran] = useRemovePelajaranMutation();
    const [removeItem, setRemoveItem] = useState(null);
    const handleRemove = (pelajaran) => {
        setRemoveItem(pelajaran);
        setShowRemoveModal(true);
    };
    const handleDelete = async (id) => {
        await deletePelajaran(id).unwrap();
    };

    // edit
    const [selectedPelajaran, setSelectedPelajaran] = useState(null);
    const handleEdit = (pelajaran) => {
        setSelectedPelajaran(pelajaran);
        setShowEditModal(true);
    };

    // data
    const { data, isLoading, isError } = useSeeAllPelajaranQuery();
    const allData = data?.data ?? [];

    const filtered = useMemo(() => {
        if (!search.trim()) return allData;
        const q = search.toLowerCase();
        return allData.filter(
            (p) => p.namaPelajaran.toLowerCase().includes(q) || p.kodePelajaran.toLowerCase().includes(q),
        );
    }, [allData, search]);

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* ── Header ── */}
                    {(isAdmin || isWakilKepalaSekolah) && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Data Pelajaran</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    {isLoading ? 'Memuat data...' : `${allData.length} mata pelajaran terdaftar`}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                                Tambah Pelajaran
                            </button>
                        </div>
                    )}

                    {/* ── Search ── */}
                    <div className="relative mb-6 max-w-sm">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.6}
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Cari nama atau kode pelajaran..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                        />
                    </div>

                    {/* ── Error ── */}
                    {isError && (
                        <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
                            <svg
                                className="w-4 h-4 shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 8v4M12 16h.01" />
                            </svg>
                            Gagal memuat data pelajaran. Coba refresh halaman.
                        </div>
                    )}

                    {/* ── Skeleton ── */}
                    {isLoading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    )}

                    {/* ── Grid Cards ── */}
                    {!isLoading && !isError && (
                        <>
                            {filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                                    <svg
                                        className="w-10 h-10"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.2}
                                    >
                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                    </svg>
                                    <p className="mt-3 text-sm font-medium">
                                        {search ? 'Tidak ada pelajaran yang cocok' : 'Belum ada data pelajaran'}
                                    </p>
                                    {search && (
                                        <button
                                            onClick={() => setSearch('')}
                                            className="mt-2 text-xs text-blue-500 hover:underline"
                                        >
                                            Hapus pencarian
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <p className="text-xs text-gray-400 mb-4">
                                        Menampilkan{' '}
                                        <span className="font-semibold text-gray-600">{filtered.length}</span> dari{' '}
                                        <span className="font-semibold text-gray-600">{allData.length}</span> pelajaran
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {filtered.map((item, index) => (
                                            <a key={item.id} href={`/data-pelajaran/${item.id}`}>
                                                <PelajaranCard
                                                    item={item}
                                                    index={index}
                                                    onEdit={handleEdit}
                                                    onRemove={handleRemove}
                                                    user={user}
                                                />
                                            </a>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            {showCreateModal && (
                <CreateModal
                    onCancel={() => setShowCreateModal(false)}
                    icon={<FaUserPlus />}
                    title="Tambah Pelajaran"
                    formTambah={FormTambahPelajaran}
                    successTitle="Pelajaran Berhasil Dibuat"
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
                    displayName="namaPelajaran"
                    onConfirm={handleDelete}
                    successTitle="Pelajaran Berhasil di Hapus"
                    successMessage="Berhasil"
                />
            )}
        </>
    );
}
