'use client';

import { useState } from 'react';
import { useSeeAllSiswaQuery } from '@/src/hooks/api/siswaSliceAPI';
import DetailPoin from '@/src/app/conponents/modal/poinModal';
import CreateModal from '@/src/app/conponents/modal/crud/createModal';
import { getInitials } from '@/src/hooks/utils/initialHelper';
import { FaUserPlus } from 'react-icons/fa';
import FormTambahPoinSiswa from '@/src/app/conponents/form/crud/tambah-data/poinPlus';
import { selectUser } from '@/src/hooks/api/authSliceAPI';
import { useSelector } from 'react-redux';
import Table from '@/src/app/conponents/table/page';

const STATUS_STYLE = {
    Aman: 'bg-green-50 text-green-700',
    Perhatian: 'bg-amber-50 text-amber-700',
    'SP 1': 'bg-orange-50 text-orange-700',
    'SP 2': 'bg-red-50 text-red-700',
    Dikeluarkan: 'bg-red-100 text-red-800',
};

function getStatus(poin) {
    if (poin >= 300) return 'Dikeluarkan';
    if (poin >= 200) return 'SP 2';
    if (poin >= 100) return 'SP 1';
    if (poin >= 20) return 'Perhatian';
    return 'Aman';
}

export default function DataPoinSiswa() {
    const [search, setSearch] = useState('');
    const [selectedSiswa, setSelectedSiswa] = useState(null);
    const [activeTab, setActiveTab] = useState('plus');
    const [showTambahModal, setShowTambahModal] = useState(false);

    const { data, isLoading, isError } = useSeeAllSiswaQuery();
    const siswaData = data?.data?.data ?? [];

    const totalPoinPlus = (s) => s.totalPoinPlus ?? 0;
    const totalPoinMinus = (s) => s.totalPoinMinus ?? 0;

    const filtered = siswaData
        .filter((s) => s.namaSiswa.toLowerCase().includes(search.toLowerCase()))
        .map((siswa, index) => ({ no: index + 1, ...siswa }));

    const handleLihat = (siswa) => {
        setSelectedSiswa(siswa);
        setActiveTab('plus');
    };

    const handleTambah = (siswa) => {
        setSelectedSiswa(siswa);
        setShowTambahModal(true);
    };

    const user = useSelector(selectUser);
    const isAdmin = user?.role === 'Admin';
    const isWakilKepalaSekolah = user?.role === 'WakilKepalaSekolah';
    const isWaliKelas = user?.role === 'WaliKelas';
    const isKepalaSekolah = user?.role === 'KepalaSekolah'
    const canEdit = isAdmin || isWakilKepalaSekolah || isWaliKelas || isKepalaSekolah;

    const columns = [
        { key: 'no', label: 'No' },
        {
            key: 'nis',
            label: 'NIS',
            render: (row) => <span className="text-gray-500 text-xs whitespace-nowrap">{row.nis ?? '-'}</span>,
        },
        {
            key: 'namaSiswa',
            label: 'Nama Siswa',
            render: (row) => (
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                        {getInitials(row.namaSiswa)}
                    </div>
                    <span className="font-medium text-gray-800">{row.namaSiswa}</span>
                </div>
            ),
        },
        {
            key: 'kelas',
            label: 'Kelas',
            render: (row) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 whitespace-nowrap">
                    {row.kelas?.kodeKelas} · {row.kelas?.namaKelas}
                </span>
            ),
        },
        {
            key: 'poinPlus',
            label: 'Poin Plus',
            render: (row) => (
                <span className="font-medium text-green-600 whitespace-nowrap">+{totalPoinPlus(row)}</span>
            ),
        },
        {
            key: 'poinMinus',
            label: 'Poin Minus',
            render: (row) => <span className="font-medium text-red-600 whitespace-nowrap">-{totalPoinMinus(row)}</span>,
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => {
                const status = getStatus(totalPoinMinus(row));
                return (
                    <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_STYLE[status]}`}
                    >
                        ● {status}
                    </span>
                );
            },
        },
        {
            key: 'aksi',
            label: 'Aksi',
            render: (row) => (
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                    <button
                        onClick={() => handleLihat(row)}
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium whitespace-nowrap"
                    >
                        Lihat →
                    </button>
                    {canEdit && (
                        <button
                            onClick={() => handleTambah(row)}
                            className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors font-medium whitespace-nowrap"
                        >
                            + Tambah
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-4 sm:mb-5">
                        <h1 className="text-lg sm:text-xl font-medium text-gray-900">Data Poin Siswa</h1>
                        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Rekap poin plus dan minus siswa</p>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5">
                        <div className="bg-white rounded-xl border border-gray-100 px-3 sm:px-4 py-2.5 sm:py-3">
                            <p className="text-xs text-gray-400 mb-1">Total Siswa</p>
                            <p className="text-xl sm:text-2xl font-medium text-gray-800">{siswaData.length}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 px-3 sm:px-4 py-2.5 sm:py-3">
                            <p className="text-xs text-gray-400 mb-1">Total Poin Plus</p>
                            <p className="text-xl sm:text-2xl font-medium text-green-600">
                                +{siswaData.reduce((acc, s) => acc + totalPoinPlus(s), 0)}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 px-3 sm:px-4 py-2.5 sm:py-3">
                            <p className="text-xs text-gray-400 mb-1">Total Poin Minus</p>
                            <p className="text-xl sm:text-2xl font-medium text-red-600">
                                -{siswaData.reduce((acc, s) => acc + totalPoinMinus(s), 0)}
                            </p>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-5">
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
                        {isLoading && <p className="text-center text-gray-400 py-12 text-sm">Memuat data...</p>}
                        {isError && <p className="text-center text-red-400 py-12 text-sm">Gagal memuat data</p>}
                        {!isLoading && !isError && <Table columns={columns} data={filtered} />}

                        {/* Footer */}
                        {!isLoading && !isError && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-400">
                                    {filtered.length} dari {siswaData.length} siswa ditampilkan
                                </p>
                            </div>
                        )}
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
