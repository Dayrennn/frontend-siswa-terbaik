'use client';

import { useState } from 'react';
import { useSeeAllKehadiranQuery } from '../../../../hooks/api/kehadiranSliceAPI';
import { useSeeAllTahunAjaranQuery } from '../../../../hooks/api/tahunAjaranSliceAPI';
import { useGetKelasByTahunAjaranQuery } from '../../../../hooks/api/kelasSliceAPI';
import { useSeeAllPertemuanByTahunAndKelasQuery } from '../../../../hooks/api/pertemuanSliceAPI';
import Table from '../../../conponents/table/page';

const STATUS_STYLE = {
    Hadir: 'bg-emerald-100 text-emerald-700',
    Izin: 'bg-blue-100 text-blue-700',
    Sakit: 'bg-amber-100 text-amber-700',
    Alpha: 'bg-red-100 text-red-600',
};

export default function DataKehadiran() {
    const [tahunAjaranId, setTahunAjaranId] = useState('');
    const [pertemuanId, setPertemuanId] = useState('');
    const [kelasId, setKelasId] = useState('');
    const [tanggal, setTanggal] = useState('');

    const { data: tahunAjaranData } = useSeeAllTahunAjaranQuery();

    const { data: kelasData } = useGetKelasByTahunAjaranQuery(tahunAjaranId, {
        skip: !tahunAjaranId,
    });

    const { data: pertemuanData } = useSeeAllPertemuanByTahunAndKelasQuery(
        { tahunAjaranId, kelasId },
        { skip: !tahunAjaranId || !kelasId },
    );

    const {
        data: kehadiranData,
        isLoading,
        isError,
    } = useSeeAllKehadiranQuery({
        ...(tahunAjaranId && { tahunAjaranId }),
        ...(kelasId && { kelasId }),
        ...(tanggal && { tanggal }),
        ...(pertemuanId && { pertemuanId }),
    });

    const tableData = kehadiranData?.data?.data?.map((item, index) => ({ no: index + 1, ...item })) ?? [];

    const handleReset = () => {
        setTahunAjaranId('');
        setKelasId('');
        setTanggal('');
        setPertemuanId('');
    };

    const columns = [
        { key: 'no', label: 'No' },
        {
            key: 'namaSiswa',
            label: 'Nama Siswa',
            render: (row) => <span className="text-gray-700">{row.siswa?.namaSiswa || '-'}</span>,
        },
        {
            key: 'kelas',
            label: 'Kelas',
            render: (row) => (
                <span className="text-gray-700">
                    {row.siswa?.kelas ? `${row.siswa.kelas.kodeKelas} - ${row.siswa.kelas.namaKelas}` : '-'}
                </span>
            ),
        },
        {
            key: 'tahunAjaran',
            label: 'Tahun Ajaran',
            render: (row) => <span className="text-gray-700">{row.tahunAjaran?.namaTahunAjaran || '-'}</span>,
        },
        {
            key: 'tanggalKehadiran',
            label: 'Tanggal',
            render: (row) => <span className="text-gray-700">{row.tanggalKehadiran?.split('T')[0] || '-'}</span>,
        },
        {
            key: 'statusKehadiran',
            label: 'Status',
            render: (row) => (
                <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[row.statusKehadiran] ?? ''}`}
                >
                    {row.statusKehadiran || '-'}
                </span>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="mx-auto max-w-7xl bg-white p-6 shadow-md rounded-xl space-y-5">
                <h1 className="text-2xl font-bold text-gray-800">Data Kehadiran</h1>

                {/* Filter */}
                <div className="flex flex-wrap gap-3 items-center">
                    <select
                        value={tahunAjaranId}
                        onChange={(e) => {
                            setTahunAjaranId(e.target.value);
                            setKelasId('');
                        }}
                        className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Semua Tahun Ajaran</option>
                        {tahunAjaranData?.data?.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.namaTahunAjaran}
                            </option>
                        ))}
                    </select>

                    <select
                        value={kelasId}
                        onChange={(e) => setKelasId(e.target.value)}
                        disabled={!tahunAjaranId}
                        className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">Semua Kelas</option>
                        {kelasData?.data?.map((k) => (
                            <option key={k.id} value={k.id}>
                                {k.kodeKelas} - {k.namaKelas}
                            </option>
                        ))}
                    </select>

                    <select
                        value={pertemuanId}
                        onChange={(e) => setPertemuanId(e.target.value)}
                        disabled={!tahunAjaranId || !kelasId}
                        className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">Semua Pertemuan</option>
                        {pertemuanData?.data?.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.namaPertemuan}
                            </option>
                        ))}
                    </select>

                    {(tahunAjaranId || kelasId || tanggal) && (
                        <button
                            onClick={handleReset}
                            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            Reset Filter
                        </button>
                    )}
                </div>

                {isLoading && <p className="text-center text-gray-400 py-8">Memuat Data...</p>}
                {isError && <p className="text-center text-red-400 py-8">Gagal Memuat Data</p>}
                {!isLoading && !isError && <Table columns={columns} data={tableData} />}
            </div>
        </div>
    );
}
