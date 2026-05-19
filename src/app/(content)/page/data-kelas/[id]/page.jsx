"use client"

import { useParams } from "next/navigation";
import { useState } from "react";
import { useGetKelasByIdQuery } from "../../../../../hooks/api/kelasSliceAPI";
import Table from "../../../../conponents/table/page"

const TABS = [
    { key: 'waliKelas', label: 'Wali Kelas' },
    { key: 'siswa', label: 'Data Siswa' },
    { key: 'absen', label: 'Data Absen' },
];

export default function DetailKelas() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('waliKelas');
    const { data: kelasData, isLoading, isError } = useGetKelasByIdQuery(id);

    const kelas = kelasData?.data;

    const waliKelasData =
        kelas?.waliKelas?.map((item, index) => ({
            no: index + 1,
            ...item,
        })) ?? [];

    const waliKelasColumns = [
        { key: 'no', label: 'No' },
        {
            key: 'username',
            label: 'Nama Guru',
            render: (row) => <span className='text-gray-700'>{row.username || '-'}</span>,
        },
        {
            key: 'telephone',
            label: 'No. Telp',
            render: (row) => <span className='text-gray-700'>{row.telephone || '-'}</span>,
        },
        {
            key: 'pelajaran',
            label: 'Pelajaran',
            render: (row) => (
                <span className='text-gray-700'>
                    {Array.isArray(row.pelajaran) && row.pelajaran.length > 0
                        ? row.pelajaran.map((p) => p.namaPelajaran).join(', ')
                        : '-'}
                </span>
            ),
        },
    ];

    // siswa columns & data bisa ditambah nanti
    const siswaColumns = [
        { key: 'no', label: 'No' },
        { key: 'namaSiswa', label: 'Nama Siswa' },
        { key: 'nis', label: 'NIS' },
        { key: 'tahunAjaran', label: 'Tahun Ajaran' },
    ];

    const absenColoumns = [
        { key: 'no', label: 'No' },
        { key: 'namaSiswa', label: 'Nama Siswa' },
        { key: 'kehadiran', label: 'Data Absen' }
    ]

    return (
        <div className='min-h-screen bg-gray-100'>
            <div className='mx-auto max-w-7xl bg-white p-6 shadow-md rounded-xl'>

                {/* Header */}
                <div className='mb-6'>
                    <h1 className='text-2xl font-bold text-gray-800'>
                        {kelas ? `Kelas ${kelas.kodeKelas} - ${kelas.namaKelas}` : 'Detail Kelas'}
                    </h1>
                </div>

                {/* Tab Menu */}
                <div className='flex gap-1 border-b border-gray-200 mb-6'>
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab.key
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {isLoading && <p className='text-center text-gray-400 py-8'>Memuat Data...</p>}
                {isError && <p className='text-center text-red-400 py-8'>Gagal Memuat Data</p>}

                {!isLoading && !isError && (
                    <>
                        {activeTab === 'waliKelas' && (
                            <Table columns={waliKelasColumns} data={waliKelasData} />
                        )}
                        {activeTab === 'siswa' && (
                            <Table columns={siswaColumns} data={[]} /> // ← isi nanti
                        )}
                        {activeTab === 'absen' && (
                            <Table columns={absenColoumns} data={[]} /> // ← isi nanti
                        )}
                    </>
                )}
            </div>
        </div>
    );
}