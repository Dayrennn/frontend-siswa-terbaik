'use client';

import { useMemo, useState } from 'react';
import { FaChartLine, FaLayerGroup, FaMedal, FaUsers } from 'react-icons/fa';
import { useGetKelasByTahunAjaranQuery } from '@/src/hooks/api/kelasSliceAPI';
import { useSeeAllKelasIndukQuery } from '@/src/hooks/api/kelasIndukSliceAPI';
import { useSeeRankingAngkatanQuery, useSeeRankingKelasQuery } from '@/src/hooks/api/siswaSliceAPI';
import { useSeeAllTahunAjaranQuery } from '@/src/hooks/api/tahunAjaranSliceAPI';

const EMPTY_MESSAGE = 'Ranking belum tersedia. Pastikan data nilai sudah diinput dan SMART sudah dihitung.';

const getKelasLabel = (ranking) => {
    const kelas = ranking?.kelas ?? ranking?.siswa?.kelas;
    if (!kelas) return '-';

    return [kelas.kodeKelas, kelas.namaKelas].filter(Boolean).join(' - ') || '-';
};

const formatNilaiAkhir = (value) => {
    const numberValue = Number(value);
    if (!Number.isFinite(numberValue)) return '-';

    return numberValue.toFixed(2);
};

export default function DataRanking() {
    const [mode, setMode] = useState('kelas');
    const [tahunAjaranId, setTahunAjaranId] = useState('');
    const [kelasId, setKelasId] = useState('');
    const [kelasIndukId, setKelasIndukId] = useState('');

    const { data: tahunAjaranData, isLoading: isLoadingTahunAjaran } = useSeeAllTahunAjaranQuery();
    const tahunAjaranList = useMemo(() => tahunAjaranData?.data ?? [], [tahunAjaranData]);
    const defaultTahunAjaranId = useMemo(() => {
        const tahunAktif = tahunAjaranList.find((tahun) => tahun.status === 'Aktif');
        return (tahunAktif ?? tahunAjaranList[0])?.id ?? '';
    }, [tahunAjaranList]);
    const activeTahunAjaranId = tahunAjaranId || defaultTahunAjaranId;

    const { data: kelasData, isLoading: isLoadingKelas } = useGetKelasByTahunAjaranQuery(activeTahunAjaranId, {
        skip: !activeTahunAjaranId,
    });

    // Semua kelas pada tahun ajaran terpilih (dipakai kedua mode)
    const allKelasList = useMemo(() => kelasData?.data ?? [], [kelasData]);

    // Kelas Induk untuk mode "Ranking Angkatan"
    const { data: kelasIndukData, isLoading: isLoadingKelasInduk } = useSeeAllKelasIndukQuery(undefined, {
        skip: mode !== 'angkatan',
    });
    const kelasIndukList = useMemo(() => kelasIndukData?.data ?? [], [kelasIndukData]);
    const kelasIndukMasihAda = kelasIndukList.some((k) => k.id === kelasIndukId);
    const activeKelasIndukId = kelasIndukMasihAda ? kelasIndukId : (kelasIndukList[0]?.id ?? '');

    // Mode kelas: semua kelas dalam tahun ajaran
    // Mode angkatan: hanya kelas yang berada di bawah kelas induk terpilih (filter tampilan opsional)
    const kelasList = useMemo(() => {
        if (mode === 'kelas') return allKelasList;
        if (!activeKelasIndukId) return [];
        return allKelasList.filter((kelas) => kelas.kelasInduk?.id === activeKelasIndukId);
    }, [mode, allKelasList, activeKelasIndukId]);

    const kelasMasihAda = kelasList.some((kelas) => kelas.id === kelasId);
    const activeKelasId =
        mode === 'kelas' ? (kelasMasihAda ? kelasId : (kelasList[0]?.id ?? '')) : kelasMasihAda ? kelasId : '';

    const {
        data: rankingKelasData,
        isFetching: isFetchingRankingKelas,
        isError: isErrorRankingKelas,
    } = useSeeRankingKelasQuery(
        { tahunAjaranId: activeTahunAjaranId, kelasId: activeKelasId },
        {
            skip: mode !== 'kelas' || !activeTahunAjaranId || !activeKelasId,
        },
    );

    const {
        data: rankingAngkatanData,
        isFetching: isFetchingRankingAngkatan,
        isError: isErrorRankingAngkatan,
    } = useSeeRankingAngkatanQuery(
        { tahunAjaranId: activeTahunAjaranId, kelasIndukId: activeKelasIndukId },
        { skip: mode !== 'angkatan' || !activeTahunAjaranId || !activeKelasIndukId },
    );

    const rankingSource = mode === 'kelas' ? rankingKelasData?.data : rankingAngkatanData?.data;
    const rankingData = useMemo(() => {
        let data = rankingSource ?? [];

        // Mode angkatan: kalau kelas dipilih, saring tampilan ke kelas itu saja,
        // peringkat yang ditampilkan tetap peringkat asli se-angkatan (tidak dihitung ulang)
        if (mode === 'angkatan' && activeKelasId) {
            data = data.filter((ranking) => (ranking.kelas?.id ?? ranking.siswa?.kelas?.id) === activeKelasId);
        }

        return data
            .slice()
            .sort((a, b) => (a.peringkat ?? Number.MAX_SAFE_INTEGER) - (b.peringkat ?? Number.MAX_SAFE_INTEGER));
    }, [rankingSource, mode, activeKelasId]);

    const isLoadingRanking = mode === 'kelas' ? isFetchingRankingKelas : isFetchingRankingAngkatan;
    const isErrorRanking = mode === 'kelas' ? isErrorRankingKelas : isErrorRankingAngkatan;
    const selectedTahunAjaran = tahunAjaranList.find((tahun) => tahun.id === activeTahunAjaranId);
    const selectedKelas = kelasList.find((kelas) => kelas.id === activeKelasId);
    const selectedKelasInduk = kelasIndukList.find((k) => k.id === activeKelasIndukId);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-xl font-medium text-gray-900">Ranking & SMART</h1>
                        <p className="mt-0.5 text-sm text-gray-400">
                            Hasil ranking SMART dari backend untuk seluruh siswa
                        </p>
                    </div>
                    <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
                        <FaChartLine />
                        SMART backend
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 mb-5 md:grid-cols-3">
                    <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                        <p className="text-xs text-gray-400 mb-1">Mode</p>
                        <p className="text-2xl font-medium text-gray-800">{mode === 'kelas' ? 'Kelas' : 'Angkatan'}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                        <p className="text-xs text-gray-400 mb-1">Tahun Ajaran</p>
                        <p className="text-2xl font-medium text-gray-800">
                            {selectedTahunAjaran?.namaTahunAjaran ?? '-'}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                        <p className="text-xs text-gray-400 mb-1">Data Ditampilkan</p>
                        <p className="text-2xl font-medium text-blue-600">{rankingData.length}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div
                            className={`grid w-full grid-cols-1 gap-3 md:grid-cols-2 ${
                                mode === 'angkatan' ? 'lg:max-w-3xl lg:grid-cols-3' : 'lg:max-w-2xl'
                            }`}
                        >
                            <label className="block">
                                <span className="text-xs font-medium text-gray-500">Tahun Ajaran</span>
                                <select
                                    value={activeTahunAjaranId}
                                    onChange={(event) => {
                                        setTahunAjaranId(event.target.value);
                                        setKelasId('');
                                        setKelasIndukId('');
                                    }}
                                    className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">Pilih tahun ajaran</option>
                                    {tahunAjaranList.map((tahun) => (
                                        <option key={tahun.id} value={tahun.id}>
                                            {tahun.namaTahunAjaran} - {tahun.status}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {mode === 'angkatan' && (
                                <label className="block">
                                    <span className="text-xs font-medium text-gray-500">Kelas Induk (Angkatan)</span>
                                    <select
                                        value={activeKelasIndukId}
                                        onChange={(event) => {
                                            setKelasIndukId(event.target.value);
                                            setKelasId('');
                                        }}
                                        disabled={isLoadingKelasInduk || kelasIndukList.length === 0}
                                        className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:text-gray-400"
                                    >
                                        <option value="">
                                            {isLoadingKelasInduk ? 'Memuat angkatan...' : 'Pilih kelas induk'}
                                        </option>
                                        {kelasIndukList.map((k) => (
                                            <option key={k.id} value={k.id}>
                                                {k.namaKelasInduk}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )}

                            <label className="block">
                                <span className="text-xs font-medium text-gray-500">Kelas</span>
                                <select
                                    value={activeKelasId}
                                    onChange={(event) => setKelasId(event.target.value)}
                                    disabled={
                                        mode === 'kelas'
                                            ? !activeTahunAjaranId || isLoadingKelas || kelasList.length === 0
                                            : !activeKelasIndukId || isLoadingKelas || kelasList.length === 0
                                    }
                                    className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:text-gray-400"
                                >
                                    <option value="">
                                        {isLoadingKelas
                                            ? 'Memuat kelas...'
                                            : mode === 'angkatan'
                                              ? 'Semua kelas dalam angkatan'
                                              : 'Pilih kelas'}
                                    </option>
                                    {kelasList.map((kelas) => (
                                        <option key={kelas.id} value={kelas.id}>
                                            {kelas.kodeKelas} - {kelas.namaKelas}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setMode('kelas');
                                    setKelasId('');
                                }}
                                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                    mode === 'kelas'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-800'
                                }`}
                            >
                                <FaLayerGroup />
                                Ranking Kelas
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setMode('angkatan');
                                    setKelasId('');
                                }}
                                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                    mode === 'angkatan'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-800'
                                }`}
                            >
                                <FaUsers />
                                Ranking Angkatan
                            </button>
                        </div>
                    </div>

                    {mode === 'kelas' && selectedKelas && (
                        <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                            Menampilkan ranking kelas {selectedKelas.kodeKelas} - {selectedKelas.namaKelas}
                        </div>
                    )}

                    {mode === 'angkatan' && selectedKelasInduk && (
                        <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                            Menampilkan ranking angkatan {selectedKelasInduk.namaKelasInduk}
                            {selectedKelas ? ` — disaring ke kelas ${selectedKelas.kodeKelas} - ${selectedKelas.namaKelas}` : ''}
                        </div>
                    )}

                    {(isLoadingTahunAjaran || isLoadingRanking) && (
                        <p className="text-center text-gray-400 py-12 text-sm">Memuat ranking...</p>
                    )}

                    {!isLoadingTahunAjaran && !isLoadingRanking && isErrorRanking && (
                        <p className="text-center text-red-400 py-12 text-sm">Gagal memuat ranking</p>
                    )}

                    {!isLoadingTahunAjaran && !isLoadingRanking && !isErrorRanking && !activeTahunAjaranId && (
                        <p className="text-center text-gray-400 py-12 text-sm">Pilih tahun ajaran terlebih dahulu</p>
                    )}

                    {!isLoadingTahunAjaran &&
                        !isLoadingRanking &&
                        !isErrorRanking &&
                        mode === 'kelas' &&
                        activeTahunAjaranId &&
                        kelasList.length === 0 && (
                            <p className="text-center text-gray-400 py-12 text-sm">
                                Tidak ada kelas pada tahun ajaran ini.
                            </p>
                        )}

                    {!isLoadingTahunAjaran &&
                        !isLoadingRanking &&
                        !isErrorRanking &&
                        mode === 'angkatan' &&
                        activeTahunAjaranId &&
                        !isLoadingKelasInduk &&
                        kelasIndukList.length === 0 && (
                            <p className="text-center text-gray-400 py-12 text-sm">
                                Belum ada data kelas induk (angkatan).
                            </p>
                        )}

                    {!isLoadingTahunAjaran &&
                        !isLoadingRanking &&
                        !isErrorRanking &&
                        activeTahunAjaranId &&
                        ((mode === 'kelas' && kelasList.length > 0) ||
                            (mode === 'angkatan' && activeKelasIndukId)) &&
                        rankingData.length === 0 && (
                            <p className="text-center text-gray-400 py-12 text-sm">{EMPTY_MESSAGE}</p>
                        )}

                    {!isLoadingTahunAjaran && !isLoadingRanking && !isErrorRanking && rankingData.length > 0 && (
                        <div className="overflow-x-auto rounded-xl border border-gray-100">
                            <table className="w-full min-w-[900px] text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50">
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Peringkat
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Nama Siswa
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            NIS
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Kelas
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Nilai Akhir SMART
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Scope
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 bg-white">
                                    {rankingData.map((ranking) => (
                                        <tr key={ranking.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3 text-gray-700">
                                                <span className="inline-flex items-center gap-2 font-medium text-gray-900">
                                                    <FaMedal className="text-amber-500" />
                                                    {ranking.peringkat ?? '-'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-gray-700">
                                                <span className="font-medium text-gray-800">
                                                    {ranking.siswa?.namaSiswa ?? '-'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-gray-500">{ranking.siswa?.nis ?? '-'}</td>
                                            <td className="px-5 py-3 text-gray-700">
                                                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                                    {getKelasLabel(ranking)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-gray-700">
                                                <span className="font-semibold text-gray-900">
                                                    {formatNilaiAkhir(ranking.nilaiAkhir)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-gray-700">
                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                                                    {ranking.scope ?? '-'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!isLoadingTahunAjaran && !isLoadingRanking && !isErrorRanking && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400">
                                Menampilkan {rankingData.length} ranking
                                {selectedTahunAjaran ? ` pada tahun ajaran ${selectedTahunAjaran.namaTahunAjaran}` : ''}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}