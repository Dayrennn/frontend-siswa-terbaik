'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useSeeAllTahunAjaranQuery } from '@/src/hooks/api/tahunAjaranSliceAPI';
import { useSeeAllSiswaByEskulQuery } from '@/src/hooks/api/siswaSliceAPI';
import { useInputNilaiEskulMutation } from '@/src/hooks/api/nilaiEskulSliceAPI';

export default function DataSiswaEskul() {
    const { eskulId } = useParams();
    const [search, setSearch] = useState('');
    const [selectedTahunAjaranId, setSelectedTahunAjaranId] = useState('');
    const [nilaiMap, setNilaiMap] = useState({});
    const [saveSuccess, setSaveSuccess] = useState(false);

    const { data: tahunAjaranData, isLoading: tahunAjaranLoading } = useSeeAllTahunAjaranQuery();

    const { data, isLoading, isError } = useSeeAllSiswaByEskulQuery(
        { eskulId, tahunAjaranId: selectedTahunAjaranId },
        { skip: !eskulId || !selectedTahunAjaranId },
    );

    const [inputNilaiEskul, { isLoading: isSaving }] = useInputNilaiEskulMutation();

    const tahunAjaranList = tahunAjaranData?.data ?? [];

    // Nilai dari server sebagai base
    const nilaiMapFromServer = Object.fromEntries(
        (data?.data ?? []).map((siswa) => {
            const nilaiEskul = siswa.eskul?.find((e) => e.eskulId === eskulId);
            return [siswa.id, nilaiEskul?.nilai ?? 0];
        }),
    );

    // Merge: perubahan user menang atas data server
    const resolvedNilaiMap = { ...nilaiMapFromServer, ...nilaiMap };

    const tableData =
        data?.data
            ?.map((siswa, index) => ({ no: index + 1, ...siswa }))
            .filter((item) => item.namaSiswa?.toLowerCase().includes(search.toLowerCase())) ?? [];

    const selectedTahunAjaran = tahunAjaranList.find((t) => t.id === selectedTahunAjaranId);
    const isReady = eskulId && selectedTahunAjaranId;

    const handleNilaiChange = (siswaId, value) => {
        setNilaiMap((prev) => ({ ...prev, [siswaId]: Number(value) }));
    };

    const handleSimpan = async () => {
        try {
            const nilaiSiswa = Object.entries(resolvedNilaiMap).map(([siswaId, nilai]) => ({
                siswaId,
                nilai,
            }));
            await inputNilaiEskul({
                eskulId,
                tahunAjaranId: selectedTahunAjaranId,
                nilaiSiswa,
            }).unwrap();
            setNilaiMap({}); // reset override user, data server yg jadi acuan
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="mx-auto max-w-7xl bg-white p-6 shadow-md rounded-xl">
                {/* Header */}
                <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Data Siswa Eskul</h1>
                        {selectedTahunAjaran && (
                            <p className="text-sm text-gray-500 mt-1">{selectedTahunAjaran.namaTahunAjaran}</p>
                        )}
                    </div>
                </div>

                {saveSuccess && (
                    <div className="mt-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">
                        ✓ Nilai berhasil disimpan
                    </div>
                )}

                {/* Filter */}
                <div className="mt-5 flex flex-col sm:flex-row gap-3 mb-4">
                    <select
                        value={selectedTahunAjaranId}
                        onChange={(e) => {
                            setSelectedTahunAjaranId(e.target.value);
                            setNilaiMap({}); // reset saat ganti tahun ajaran
                            setSaveSuccess(false);
                        }}
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

                    <input
                        type="text"
                        placeholder="Cari nama siswa..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        disabled={!isReady}
                        className="flex-1 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                    />
                </div>

                {!isReady && (
                    <div className="text-center py-16 text-gray-400 text-sm">
                        Pilih tahun ajaran untuk melihat data siswa
                    </div>
                )}
                {isReady && isLoading && <p className="text-center text-gray-400 py-8">Memuat Data...</p>}
                {isReady && isError && <p className="text-center text-red-400 py-8">Gagal Memuat Data</p>}
                {isReady && !isLoading && !isError && tableData.length === 0 && (
                    <p className="text-center text-gray-400 py-8">Tidak ada data siswa</p>
                )}

                {isReady && !isLoading && !isError && tableData.length > 0 && (
                    <>
                        <div className="rounded-xl border border-gray-200 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-medium w-10">No</th>
                                        <th className="text-left px-4 py-3 font-medium">Nama Siswa</th>
                                        <th className="text-left px-4 py-3 font-medium">Kelas</th>
                                        <th className="text-right px-4 py-3 font-medium w-36">Nilai Eskul</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {tableData.map((row) => (
                                        <tr key={row.id} className="bg-white hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-gray-400">{row.no}</td>
                                            <td className="px-4 py-3 text-gray-800">{row.namaSiswa}</td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {row.kelas ? row.kelas.kodeKelas : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    value={resolvedNilaiMap[row.id] ?? 0}
                                                    onChange={(e) => handleNilaiChange(row.id, e.target.value)}
                                                    className="w-20 px-3 py-1.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 text-sm text-right"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                            <p className="text-xs text-gray-400">Total {tableData.length} siswa</p>
                            <button
                                onClick={handleSimpan}
                                disabled={isSaving}
                                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-60"
                            >
                                {isSaving ? 'Menyimpan...' : 'Simpan Nilai'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}