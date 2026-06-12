'use client';

import { useState } from 'react';
import { useSeeAllSiswaQuery } from '@/src/hooks/api/siswaSliceAPI';
import DetailPoin from '@/src/app/conponents/modal/poinModal';
import CreateModal from '@/src/app/conponents/modal/crud/createModal';
import { getInitials } from '@/src/hooks/utils/initialHelper';
import { FaUserPlus } from 'react-icons/fa';
import FormTambahPoinSiswa from '@/src/app/conponents/form/crud/tambah-data/poinPlus';

const STATUS_STYLE = {
    Baik: 'bg-green-50 text-green-700',
    Perhatian: 'bg-amber-50 text-amber-700',
    Peringatan: 'bg-red-50 text-red-700',
};

function getStatus(poin) {
    if (poin === 0) return 'Baik';
    if (poin < 20) return 'Perhatian';
    return 'Peringatan';
}

export default function DataPoinSiswa() {
    const [search, setSearch] = useState('');
    const [selectedSiswa, setSelectedSiswa] = useState(null);
    const [activeTab, setActiveTab] = useState('plus');
    const [showTambahModal, setShowTambahModal] = useState(false);

    const { data, isLoading, isError } = useSeeAllSiswaQuery();
    const siswaData = data?.data ?? [];

    const totalPoinPlus = (s) => s.totalPoinPlus ?? 0;
    const totalPoinMinus = (s) => s.totalPoinMinus ?? 0;

    const filtered = siswaData.filter((s) => s.namaSiswa.toLowerCase().includes(search.toLowerCase()));

    const handleLihat = (siswa) => {
        setSelectedSiswa(siswa);
        setActiveTab('plus');
    };

    const handleTambah = (siswa) => {
        setSelectedSiswa(siswa);
        setShowTambahModal(true);
    };

    return (
        <>
            {isLoading && <p className="text-center text-gray-400 py-12 text-sm">Memuat data...</p>}
            {isError && <p className="text-center text-red-400 py-12 text-sm">Gagal memuat data</p>}
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-5">
                        <h1 className="text-xl font-medium text-gray-900">Data Poin Siswa</h1>
                        <p className="text-sm text-gray-400 mt-0.5">Rekap poin plus dan minus siswa</p>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-3 gap-3 mb-5">
                        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                            <p className="text-xs text-gray-400 mb-1">Total Siswa</p>
                            <p className="text-2xl font-medium text-gray-800">{siswaData.length}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                            <p className="text-xs text-gray-400 mb-1">Total Poin Plus</p>
                            <p className="text-2xl font-medium text-green-600">
                                +{siswaData.reduce((acc, s) => acc + totalPoinPlus(s), 0)}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                            <p className="text-xs text-gray-400 mb-1">Total Poin Minus</p>
                            <p className="text-2xl font-medium text-red-600">
                                -{siswaData.reduce((acc, s) => acc + totalPoinMinus(s), 0)}
                            </p>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        {/* Search */}
                        <div className="mb-4 relative w-full md:w-72">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm">🔍</span>
                            <input
                                type="text"
                                placeholder="Cari nama siswa..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-8 pr-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                            />
                        </div>

                        {/* Table */}
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    {[
                                        'No',
                                        'NIS',
                                        'Nama Siswa',
                                        'Kelas',
                                        'Poin Plus',
                                        'Poin Minus',
                                        'Status',
                                        'Aksi',
                                    ].map((h) => (
                                        <th key={h} className="text-left py-2 px-3 text-xs text-gray-400 font-medium">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((siswa, index) => {
                                    const plus = totalPoinPlus(siswa);
                                    const minus = totalPoinMinus(siswa);
                                    const status = getStatus(minus);
                                    return (
                                        <tr key={siswa.id} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-2 px-3 text-gray-500">{index + 1}</td>
                                            <td className="py-2 px-3 text-gray-500 text-xs">{siswa.nis ?? '-'}</td>
                                            <td className="py-2 px-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                                                        {getInitials(siswa.namaSiswa)}
                                                    </div>
                                                    <span className="font-medium text-gray-800">{siswa.namaSiswa}</span>
                                                </div>
                                            </td>
                                            <td className="py-2 px-3">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                    {siswa.kelas?.kodeKelas} · {siswa.kelas?.namaKelas}
                                                </span>
                                            </td>
                                            <td className="py-2 px-3 font-medium text-green-600">+{plus}</td>
                                            <td className="py-2 px-3 font-medium text-red-600">-{minus}</td>
                                            <td className="py-2 px-3">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[status]}`}
                                                >
                                                    ● {status}
                                                </span>
                                            </td>
                                            <td className="py-2 px-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleLihat(siswa)}
                                                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                                                    >
                                                        Lihat →
                                                    </button>
                                                    <button
                                                        onClick={() => handleTambah(siswa)}
                                                        className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors font-medium"
                                                    >
                                                        + Tambah
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Footer */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400">
                                {filtered.length} dari {siswaData.length} siswa ditampilkan
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {selectedSiswa && (
                <DetailPoin
                    selectedSiswa={selectedSiswa}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onClose={() => setSelectedSiswa(null)}
                    linkSiswa={`/page/data-pelanggaran/${selectedSiswa.id}`}
                />
            )}
            {showTambahModal && (
                <CreateModal
                    onCancel={() => {
                        setShowTambahModal(false);
                        setSelectedSiswa(null);
                    }}
                    icon={<FaUserPlus />}
                    title="Tambah Poin"
                    successTitle="Berhasil Tambah Poin"
                    successMessage="Berhasil"
                    formTambah={FormTambahPoinSiswa}
                    siswaId={selectedSiswa?.id}
                />
            )}
        </>
    );
}
