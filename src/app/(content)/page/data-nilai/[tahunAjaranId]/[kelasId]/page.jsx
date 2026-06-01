'use client';

import { useSeeAllSiswaByTahunAjaranQuery } from '../../../../../../hooks/api/siswaSliceAPI';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import EditModal from '../../../../../conponents/modal/crud/editModal';
import { FaUserPlus } from 'react-icons/fa';
import Table from '../../../../../conponents/table/page';
import NilaiModal from '@/src/app/conponents/modal/nilaiModal';
import FormEditNilaiSiswa from '@/src/app/conponents/form/crud/edit-data/nilai';


export default function DataSiswaPerTahun() {
    const { tahunAjaranId } = useParams();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showNilaiSiswaModal, setShowNilaiSiswaModal] = useState(false);
    const [search, setSearch] = useState('');

    const handleNilai = (siswa) => {
        setSelectedSiswa(siswa);
        setShowNilaiSiswaModal(true);
    };

    const [selectedSiswa, setSelectedSiswa] = useState(null);
    const handleEdit = (siswa) => {
        setSelectedSiswa(siswa);
        setShowEditModal(true);
    };

    const { data, isLoading, isError } = useSeeAllSiswaByTahunAjaranQuery(tahunAjaranId);

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
                        onClick={() => handleNilai(row)}
                        className="text-xs bg-blue-100 text-blue-500 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                        Lihat
                    </button>
                </div>
            ),
        },
    ];

    // Ambil nama tahun ajaran dari data pertama
    const namaTahunAjaran = data?.data?.[0]?.tahunAjaran?.namaTahunAjaran ?? '';

    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <div className="mx-auto max-w-7xl bg-white p-6 shadow-md rounded-xl">
                    {/* ── Judul ── */}
                    <h1 className="text-2xl font-bold text-gray-800">Data Siswa {namaTahunAjaran}</h1>

                    <div className="mt-5">
                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                            <div className="relative w-full md:w-80">
                                <input
                                    type="text"
                                    placeholder="Cari nama, kelas, atau data siswa..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-4 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        {isLoading && <p className="text-center text-gray-400 py-8">Memuat Data...</p>}
                        {isError && <p className="text-center text-red-400 py-8">Gagal Memuat Data</p>}
                        {!isLoading && !isError && <Table columns={columns} data={tableData} />}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showNilaiSiswaModal && (
                <NilaiModal
                    onCancel={() => setShowNilaiSiswaModal(false)}
                    icon={<FaUserPlus />}
                    title="Nilai Siswa"
                    siswaId={selectedSiswa?.id}
                />
            )}
            {showEditModal && (
                <EditModal
                    onCancel={() => setShowEditModal(false)}
                    icon={<FaUserPlus />}
                    title="Edit Siswa"
                    formEdit={FormEditNilaiSiswa}
                    initialData={selectedSiswa}
                    successTitle="Siswa Berhasil di Update"
                    successMessage="Berhasil"
                />
            )}
        </>
    );
}
