'use client';

import { useState } from 'react';
import { useSeeAllKehadiranQuery } from '../../../../hooks/api/kehadiranSliceAPI';
import { useSeeAllTahunAjaranQuery } from '../../../../hooks/api/tahunAjaranSliceAPI';
import { useGetKelasByTahunAjaranQuery } from '../../../../hooks/api/kelasSliceAPI';
import { useSeeAllPertemuanByTahunAndKelasQuery } from '../../../../hooks/api/pertemuanSliceAPI';
import Table from '../../../conponents/table/page';

const STATUS_STYLE = {
    Hadir: 'bg-green-50 text-green-700',
    Izin: 'bg-blue-50 text-blue-700',
    Sakit: 'bg-amber-50 text-amber-700',
    Alpha: 'bg-red-50 text-red-600',
};

const STATUS_DOT = {
    Hadir: '●',
    Izin: '●',
    Sakit: '●',
    Alpha: '●',
};

export default function DataKehadiran() {
    const [tahunAjaranId, setTahunAjaranId] = useState('');
    const [pertemuanId, setPertemuanId] = useState('');
    const [kelasId, setKelasId] = useState('');

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
        ...(pertemuanId && { pertemuanId }),
    });

    const tableData = kehadiranData?.data?.data?.map((item, index) => ({ no: index + 1, ...item })) ?? [];

    const handleReset = () => {
        setTahunAjaranId('');
        setKelasId('');
        setPertemuanId('');
    };

    const isFiltered = tahunAjaranId || kelasId || pertemuanId;

    // stat counts
    const totalHadir = tableData.filter((r) => r.statusKehadiran === 'Hadir').length;
    const totalIzin = tableData.filter((r) => r.statusKehadiran === 'Izin').length;
    const totalSakit = tableData.filter((r) => r.statusKehadiran === 'Sakit').length;
    const totalAlpha = tableData.filter((r) => r.statusKehadiran === 'Alpha').length;

    const columns = [
        { key: 'no', label: 'No' },
        {
            key: 'namaSiswa',
            label: 'Nama Siswa',
            render: (row) => <span className="font-medium text-gray-800">{row.siswa?.namaSiswa || '-'}</span>,
        },
        {
            key: 'kelas',
            label: 'Kelas',
            render: (row) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {row.siswa?.kelas ? `${row.siswa.kelas.kodeKelas} · ${row.siswa.kelas.namaKelas}` : '-'}
                </span>
            ),
        },
        {
            key: 'tahunAjaran',
            label: 'Tahun Ajaran',
            render: (row) => <span className="text-sm text-gray-500">{row.tahunAjaran?.namaTahunAjaran || '-'}</span>,
        },
        {
            key: 'tanggalKehadiran',
            label: 'Tanggal',
            render: (row) => (
                <span className="text-sm text-gray-500">{row.tanggalKehadiran?.split('T')[0] || '-'}</span>
            ),
        },
        {
            key: 'statusKehadiran',
            label: 'Status',
            render: (row) => (
                <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_STYLE[row.statusKehadiran] ?? 'bg-gray-100 text-gray-500'
                    }`}
                >
                    {STATUS_DOT[row.statusKehadiran] ?? '○'} {row.statusKehadiran || '-'}
                </span>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-5">
                    <h1 className="text-xl font-medium text-gray-900">Data Kehadiran</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Rekap kehadiran siswa berdasarkan filter</p>
                </div>

                {/* Stat Cards */}
                {!isLoading && !isError && tableData.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mb-5">
                        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                            <p className="text-xs text-gray-400 mb-1">Hadir</p>
                            <p className="text-2xl font-medium text-green-600">{totalHadir}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                            <p className="text-xs text-gray-400 mb-1">Izin</p>
                            <p className="text-2xl font-medium text-blue-600">{totalIzin}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                            <p className="text-xs text-gray-400 mb-1">Sakit</p>
                            <p className="text-2xl font-medium text-amber-600">{totalSakit}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                            <p className="text-xs text-gray-400 mb-1">Alpha</p>
                            <p className="text-2xl font-medium text-red-600">{totalAlpha}</p>
                        </div>
                    </div>
                )}

                {/* Main Card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    {/* Filter Bar */}
                    <div className="flex flex-wrap gap-2 items-center mb-4">
                        <select
                            value={tahunAjaranId}
                            onChange={(e) => {
                                setTahunAjaranId(e.target.value);
                                setKelasId('');
                                setPertemuanId('');
                            }}
                            className="text-sm border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
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
                            onChange={(e) => {
                                setKelasId(e.target.value);
                                setPertemuanId('');
                            }}
                            disabled={!tahunAjaranId}
                            className="text-sm border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
                            className="text-sm border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <option value="">Semua Pertemuan</option>
                            {pertemuanData?.data?.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.namaPertemuan}
                                </option>
                            ))}
                        </select>

                        {isFiltered && (
                            <button
                                onClick={handleReset}
                                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                ✕ Reset
                            </button>
                        )}
                    </div>

                    {/* Table */}
                    {isLoading && <p className="text-center text-gray-400 py-12 text-sm">Memuat data...</p>}
                    {isError && <p className="text-center text-red-400 py-12 text-sm">Gagal memuat data</p>}
                    {!isLoading && !isError && <Table columns={columns} data={tableData} />}

                    {/* Footer */}
                    {!isLoading && !isError && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400">{tableData.length} data kehadiran ditampilkan</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
