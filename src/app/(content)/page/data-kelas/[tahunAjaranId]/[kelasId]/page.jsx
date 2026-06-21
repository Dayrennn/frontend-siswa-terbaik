'use client';

import {
    useSeeAllSiswaByTahunAjaranAndKelasQuery,
    useRemoveSiswaMutation,
    siswaAPI,
} from '../../../../../../hooks/api/siswaSliceAPI';
import { useDispatch } from 'react-redux';
// import { kehadiranAPI } from '../../../../../../hooks/api/kehadiranSliceAPI';
import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import CreateModal from '../../../../../conponents/modal/crud/createModal';
import EditModal from '../../../../../conponents/modal/crud/editModal';
import RemoveModal from '../../../../../conponents/modal/crud/deleteModal';
import { FaUserPlus } from 'react-icons/fa';
import Table from '../../../../../conponents/table/page';
import FormTambahSiswa from '../../../../../conponents/form/crud/tambah-data/siswa';
import FormEditDataSiswa from '../../../../../conponents/form/crud/edit-data/siswa';
import { exportToExcel, downloadTemplate, parseImportedExcel } from '../../../../../../hooks/utils/excelHelper';
// import TabKehadiran from '../../../../../conponents/ui/tabKehadiran';

const TABS = ['Data Siswa', 'Kehadiran'];

export default function DataSiswaPerTahun() {
    const dispatch = useDispatch();
    const { tahunAjaranId, kelasId } = useParams();
    const [activeTab, setActiveTab] = useState('Data Siswa');

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
    const handleAfterSuccess = () => {
        // dispatch(kehadiranAPI.util.invalidateTags(['kehadiranAPI']));
        dispatch(siswaAPI.util.invalidateTags(['siswaAPI']));
    };
    const handleDelete = async (id) => {
        await deleteSiswa(id).unwrap();
        // dispatch(kehadiranAPI.util.invalidateTags(['kehadiranAPI']));
        dispatch(siswaAPI.util.invalidateTags(['siswaAPI']));
    };

    const [selectedSiswa, setSelectedSiswa] = useState(null);
    const handleEdit = (siswa) => {
        setSelectedSiswa(siswa);
        setShowEditModal(true);
    };

    const { data, isLoading, isError } = useSeeAllSiswaByTahunAjaranAndKelasQuery({ tahunAjaranId, kelasId });

    const tableData =
        data?.data
            ?.map((siswa, index) => ({ no: index + 1, ...siswa }))
            .filter((item) => item.namaSiswa?.toLowerCase().includes(search.toLowerCase())) ?? [];

    const pelajaranMap = new Map();
    data?.data?.forEach((siswa) => {
        siswa.nilai?.forEach((n) => {
            pelajaranMap.set(n.pelajaran.kodePelajaran, n.pelajaran.namaPelajaran);
        });
    });
    const pelajaranList = Array.from(pelajaranMap.entries()).map(([key, label]) => ({ key, label }));

    const columns = [
        { key: 'no', label: 'No' },
        {
            key: 'nis',
            label: 'NIS',
            render: (row) => <span className="text-gray-700">{row.nis || '-'}</span>,
        },
        {
            key: 'namaSiswa',
            label: 'Nama Siswa',
            render: (row) => <span className="text-gray-700">{row.namaSiswa || '-'}</span>,
        },
        {
            key: 'tanggalLahir',
            label: 'Tanggal Lahir',
            render: (row) => <span className="text-gray-700">{row.tanggalLahir?.split('T')[0] || '-'}</span>,
        },
        {
            key: 'tahunAjaran',
            label: 'Tahun Ajaran',
            render: (row) => <span className="text-gray-700">{row.tahunAjaran?.namaTahunAjaran || '-'}</span>,
        },
        {
            key: 'kelas',
            label: 'Kelas',
            render: (row) => (
                <span className="text-gray-700">
                    {row.kelas ? `${row.kelas.kodeKelas} - ${row.kelas.namaKelas}` : '-'}
                </span>
            ),
        },
        {
            key: 'aksi',
            label: 'Aksi',
            render: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="text-xs bg-yellow-100 text-yellow-600 px-3 py-1 rounded-lg hover:bg-yellow-200 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleRemove(row)}
                        className="text-xs bg-red-100 text-red-500 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
                    >
                        Hapus
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

    // Ambil nama tahun ajaran dari data pertama
    const namaTahunAjaran = data?.data?.[0]?.tahunAjaran?.namaTahunAjaran ?? '';

    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <div className="mx-auto max-w-7xl bg-white p-6 shadow-md rounded-xl">
                    {/* ── Judul ── */}
                    <h1 className="text-2xl font-bold text-gray-800">Data Siswa {namaTahunAjaran}</h1>

                    {/* ── Tab ── */}
                    <div className="flex gap-1 mt-5 border-b border-gray-200">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
                                    activeTab === tab
                                        ? 'bg-white border border-b-white border-gray-200 text-blue-600 -mb-px'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* ── Konten Tab ── */}
                    <div className="mt-5">
                        {/* Tab: Data Siswa */}
                        {activeTab === 'Data Siswa' && (
                            <>
                                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                                    {/* Search */}
                                    <div className="relative w-full md:w-80">
                                        <input
                                            type="text"
                                            placeholder="Cari nama, kelas, atau data siswa..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full pl-4 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={downloadTemplate}
                                            className="text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            📄 Template
                                        </button>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-sm bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                        >
                                            📥 Import
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".xlsx, .xls"
                                            className="hidden"
                                            onChange={handleImport}
                                        />
                                        <button
                                            onClick={handleExport}
                                            className="text-sm bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                                        >
                                            📤 Export
                                        </button>
                                        <button
                                            onClick={() => setShowCreateModal(true)}
                                            className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            + Tambah
                                        </button>
                                    </div>
                                </div>

                                {isLoading && <p className="text-center text-gray-400 py-8">Memuat Data...</p>}
                                {isError && <p className="text-center text-red-400 py-8">Gagal Memuat Data</p>}
                                {!isLoading && !isError && <Table columns={columns} data={tableData} />}
                            </>
                        )}

                        {/* Tab: Kehadiran */}
                        {/* {activeTab === 'Kehadiran' && <TabKehadiran />} */}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showCreateModal && (
                <CreateModal
                    onCancel={() => setShowCreateModal(false)}
                    icon={<FaUserPlus />}
                    title="Tambah Siswa"
                    formTambah={FormTambahSiswa}
                    successTitle="Siswa Berhasil Dibuat"
                    successMessage="Berhasil"
                    onAfterSuccess={handleAfterSuccess}
                />
            )}
            {showEditModal && (
                <EditModal
                    onCancel={() => setShowEditModal(false)}
                    icon={<FaUserPlus />}
                    title="Edit Siswa"
                    formEdit={FormEditDataSiswa}
                    initialData={selectedSiswa}
                    successTitle="Siswa Berhasil di Update"
                    successMessage="Berhasil"
                />
            )}
            {showRemoveModal && (
                <RemoveModal
                    onCancel={() => setShowRemoveModal(false)}
                    icon={<FaUserPlus />}
                    title="Hapus Siswa"
                    initialData={removeSiswa}
                    displayName="namaSiswa"
                    onConfirm={handleDelete}
                    successTitle="Siswa Berhasil di Hapus"
                    successMessage="Berhasil"
                />
            )}
        </>
    );
}
