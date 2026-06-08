'use client';

import { useRemovePelajaranMutation, useSeeAllPelajaranQuery } from '../../../../hooks/api/pelajaranSliceAPI';
import CreateModal from '../../../conponents/modal/crud/createModal';
import EditModal from '../../../conponents/modal/crud/editModal';
import RemoveModal from '../../../conponents/modal/crud/deleteModal';
import FormTambahPelajaran from '../../../conponents/form/crud/tambah-data/pelajaran';
import { FaUserPlus } from 'react-icons/fa';
import { useState, useMemo } from 'react';
import FormEditDataPelajaran from '../../../conponents/form/crud/edit-data/pelajaran';

// ── Icon SVG ─────────────────────────────────────────────────────────────────
const IconSearch = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
);
const IconBook = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);
const IconEdit = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" />
    </svg>
);
const IconTrash = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
);
const IconUser = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);
const IconEmpty = () => (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

// ── Warna kartu berdasarkan index ─────────────────────────────────────────────
const cardColors = [
    { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600', badge: 'bg-blue-100 text-blue-700', border: 'border-blue-100' },
    { bg: 'bg-violet-50', icon: 'bg-violet-100 text-violet-600', badge: 'bg-violet-100 text-violet-700', border: 'border-violet-100' },
    { bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', badge: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-100' },
    { bg: 'bg-amber-50', icon: 'bg-amber-100 text-amber-600', badge: 'bg-amber-100 text-amber-700', border: 'border-amber-100' },
    { bg: 'bg-rose-50', icon: 'bg-rose-100 text-rose-600', badge: 'bg-rose-100 text-rose-700', border: 'border-rose-100' },
    { bg: 'bg-cyan-50', icon: 'bg-cyan-100 text-cyan-600', badge: 'bg-cyan-100 text-cyan-700', border: 'border-cyan-100' },
];

// ── Kartu Pelajaran ───────────────────────────────────────────────────────────
function PelajaranCard({ item, index, onEdit, onRemove }) {
    const color = cardColors[index % cardColors.length];
    const guruList = item.user?.length > 0 ? item.user.map((u) => u.username).join(', ') : null;

    return (
        <div className={`group relative bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-lg hover:border-gray-200 transition-all duration-200`}>
            {/* Aksen warna atas */}
            <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${color.icon.split(' ')[0].replace('bg-', 'bg-').replace('100', '400')}`} />

            {/* Header */}
            <div className="flex items-start justify-between gap-2 pt-1">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color.icon}`}>
                        <IconBook />
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm leading-snug truncate">
                            {item.namaPelajaran}
                        </p>
                        <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${color.badge}`}>
                            {item.kodePelajaran}
                        </span>
                    </div>
                </div>
            </div>

            {/* Guru */}
            <div className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2 ${color.bg}`}>
                <span className="text-gray-400 shrink-0"><IconUser /></span>
                <span className={`truncate ${guruList ? 'text-gray-700 font-medium' : 'text-gray-400 italic'}`}>
                    {guruList ?? 'Belum ada guru'}
                </span>
            </div>

            {/* Divider */}
            <hr className="border-gray-100" />

            {/* Aksi */}
            <div className="flex gap-2">
                <button
                    onClick={() => onEdit(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                >
                    <IconEdit /> Edit
                </button>
                <button
                    onClick={() => onRemove(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                >
                    <IconTrash /> Hapus
                </button>
            </div>
        </div>
    );
}

// ── Skeleton loading ──────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100" />
                <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
            </div>
            <div className="h-8 bg-gray-100 rounded-lg" />
            <div className="h-px bg-gray-100" />
            <div className="flex gap-2">
                <div className="flex-1 h-8 bg-gray-100 rounded-xl" />
                <div className="flex-1 h-8 bg-gray-100 rounded-xl" />
            </div>
        </div>
    );
}

// ── Halaman Utama ─────────────────────────────────────────────────────────────
export default function DataPelajaran() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [search, setSearch] = useState('');

    // hapus
    const [deletePelajaran] = useRemovePelajaranMutation();
    const [removeItem, setRemoveItem] = useState(null);
    const handleRemove = (pelajaran) => { setRemoveItem(pelajaran); setShowRemoveModal(true); };
    const handleDelete = async (id) => { await deletePelajaran(id).unwrap(); };

    // edit
    const [selectedPelajaran, setSelectedPelajaran] = useState(null);
    const handleEdit = (pelajaran) => { setSelectedPelajaran(pelajaran); setShowEditModal(true); };

    // data
    const { data, isLoading, isError } = useSeeAllPelajaranQuery();
    const allData = data?.data ?? [];

    const filtered = useMemo(() => {
        if (!search.trim()) return allData;
        const q = search.toLowerCase();
        return allData.filter(
            (p) => p.namaPelajaran.toLowerCase().includes(q) || p.kodePelajaran.toLowerCase().includes(q)
        );
    }, [allData, search]);

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto">

                    {/* ── Header ── */}
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
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Tambah Pelajaran
                        </button>
                    </div>

                    {/* ── Search ── */}
                    <div className="relative mb-6 max-w-sm">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <IconSearch />
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
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                            </svg>
                            Gagal memuat data pelajaran. Coba refresh halaman.
                        </div>
                    )}

                    {/* ── Skeleton ── */}
                    {isLoading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    )}

                    {/* ── Grid Cards ── */}
                    {!isLoading && !isError && (
                        <>
                            {filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                                    <IconEmpty />
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
                                        <span className="font-semibold text-gray-600">{filtered.length}</span>{' '}
                                        dari{' '}
                                        <span className="font-semibold text-gray-600">{allData.length}</span>{' '}
                                        pelajaran
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {filtered.map((item, index) => (
                                            <PelajaranCard
                                                key={item.id}
                                                item={item}
                                                index={index}
                                                onEdit={handleEdit}
                                                onRemove={handleRemove}
                                            />
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