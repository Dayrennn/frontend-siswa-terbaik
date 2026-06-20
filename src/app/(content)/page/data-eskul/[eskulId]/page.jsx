'use client';

import { useState } from 'react';
import { useSeeAllEskulQuery } from '@/src/hooks/api/eskulSliceAPI';
import { useSeeAllTahunAjaranQuery } from '@/src/hooks/api/tahunAjaranSliceAPI';
import { useSeeAllSiswaByEskulQuery } from '@/src/hooks/api/siswaSliceAPI';
import Table from '@/src/app/conponents/table/page';

export default function DataSiswaEskul() {
    const [search, setSearch] = useState('');
    const [selectedEskulId, setSelectedEskulId] = useState('');
    const [selectedTahunAjaranId, setSelectedTahunAjaranId] = useState('');

    const { data: eskulData, isLoading: eskulLoading } = useSeeAllEskulQuery();
    const { data: tahunAjaranData, isLoading: tahunAjaranLoading } = useSeeAllTahunAjaranQuery();

    const { data, isLoading, isError } = useSeeAllSiswaByEskulQuery(
        { eskulId: selectedEskulId, tahunAjaranId: selectedTahunAjaranId },
        { skip: !selectedEskulId || !selectedTahunAjaranId },
    );

    const eskulList = eskulData?.data ?? [];
    const tahunAjaranList = tahunAjaranData?.data ?? [];

    const tableData =
        data?.data
            ?.map((siswa, index) => ({ no: index + 1, ...siswa }))
            .filter((item) => item.namaSiswa?.toLowerCase().includes(search.toLowerCase())) ?? [];

    const selectedEskul = eskulList.find((e) => e.id === selectedEskulId);
    const selectedTahunAjaran = tahunAjaranList.find((t) => t.id === selectedTahunAjaranId);

    const columns = [
        { key: 'no', label: 'No' },
        {
            key: 'namaSiswa',
            label: 'Nama Siswa',
            render: (row) => <span className="text-gray-700">{row.namaSiswa || '-'}</span>,
        },
        {
            key: 'kelas',
            label: 'Kelas',
            render: (row) => (
                <span className="text-gray-700">
                    {row.kelas ? `${row.kelas.kodeKelas}` : '-'}
                </span>
            ),
        },
        {
            key: 'nilaiEskul',
            label: 'Nilai Eskul',
            render: (row) => {
                const nilaiEskul = row.eskul?.find((e) => e.eskulId === selectedEskulId);
                const nilai = nilaiEskul?.nilai;
                return (
                    <span
                        className={`font-semibold ${
                            nilai >= 75 ? 'text-green-600' : nilai > 0 ? 'text-amber-500' : 'text-gray-400'
                        }`}
                    >
                        {nilai ?? '-'}
                    </span>
                );
            },
        },
    ];

    const isReady = selectedEskulId && selectedTahunAjaranId;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="mx-auto max-w-7xl bg-white p-6 shadow-md rounded-xl">
                <h1 className="text-2xl font-bold text-gray-800">Data Siswa Eskul</h1>
                {selectedEskul && selectedTahunAjaran && (
                    <p className="text-sm text-gray-500 mt-1">
                        {selectedEskul.namaEskul} · {selectedTahunAjaran.namaTahunAjaran}
                    </p>
                )}

                <div className="mt-5 flex flex-col sm:flex-row gap-3 mb-4">

                    {/* Dropdown Tahun Ajaran */}
                    <select
                        value={selectedTahunAjaranId}
                        onChange={(e) => setSelectedTahunAjaranId(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        disabled={tahunAjaranLoading}
                    >
                        <option value="">-- Pilih Tahun Ajaran --</option>
                        {tahunAjaranList.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.namaTahunAjaran}
                            </option>
                        ))}
                    </select>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Cari nama siswa..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        disabled={!isReady}
                        className="flex-1 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                    />
                </div>

                {/* State: belum pilih filter */}
                {!isReady && (
                    <div className="text-center py-16 text-gray-400 text-sm">
                        Pilih eskul dan tahun ajaran untuk melihat data siswa
                    </div>
                )}

                {/* State: loading */}
                {isReady && isLoading && <p className="text-center text-gray-400 py-8">Memuat Data...</p>}

                {/* State: error */}
                {isReady && isError && <p className="text-center text-red-400 py-8">Gagal Memuat Data</p>}

                {/* State: kosong */}
                {isReady && !isLoading && !isError && tableData.length === 0 && (
                    <p className="text-center text-gray-400 py-8">Tidak ada data siswa</p>
                )}

                {/* Tabel */}
                {isReady && !isLoading && !isError && tableData.length > 0 && (
                    <>
                        <Table columns={columns} data={tableData} />
                        <p className="text-xs text-gray-400 mt-3">Total {tableData.length} siswa</p>
                    </>
                )}
            </div>
        </div>
    );
}