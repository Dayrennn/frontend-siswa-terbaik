'use client';

import { useMemo, useState } from 'react';
import { FaCrown, FaMedal, FaTrophy, FaLayerGroup, FaUsers, FaChartLine, FaSignInAlt } from 'react-icons/fa';
import { useGetKelasByTahunAjaranQuery } from '@/src/hooks/api/kelasSliceAPI';
import { useSeeAllKelasIndukQuery } from '@/src/hooks/api/kelasIndukSliceAPI';
import { useSeeRankingAngkatanQuery, useSeeRankingKelasQuery } from '@/src/hooks/api/siswaSliceAPI';
import { useSeeAllTahunAjaranQuery } from '@/src/hooks/api/tahunAjaranSliceAPI';
import Link from 'next/link';

const EMPTY_MESSAGE = 'Ranking belum tersedia. Pastikan data nilai sudah diinput dan SMART sudah dihitung.';

const getKelasLabel = (ranking) => {
    const kelas = ranking?.kelas ?? ranking?.siswa?.kelas;
    if (!kelas) return '-';
    return [kelas.kodeKelas, kelas.namaKelas].filter(Boolean).join(' - ') || '-';
};

const formatNilai = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n.toFixed(2) : '-';
};

const PODIUM_STYLE = {
    1: {
        icon: <FaCrown className="text-yellow-400 text-2xl sm:text-3xl" />,
        ring: 'ring-4 ring-yellow-300',
        badge: 'bg-yellow-400 text-yellow-900',
        order: 'md:order-2',
        height: 'md:h-56',
    },
    2: {
        icon: <FaMedal className="text-gray-300 text-xl sm:text-2xl" />,
        ring: 'ring-4 ring-gray-200',
        badge: 'bg-gray-300 text-gray-700',
        order: 'md:order-1',
        height: 'md:h-44',
    },
    3: {
        icon: <FaMedal className="text-amber-500 text-xl sm:text-2xl" />,
        ring: 'ring-4 ring-amber-200',
        badge: 'bg-amber-400 text-amber-900',
        order: 'md:order-3',
        height: 'md:h-36',
    },
};

export default function RankingLandingPage() {
    const [mode, setMode] = useState('kelas'); // 'kelas' | 'angkatan'
    const [tahunAjaranId, setTahunAjaranId] = useState('');
    const [kelasId, setKelasId] = useState(''); // dipakai di kedua mode, arti beda: mode kelas = scope perhitungan, mode angkatan = filter tampilan saja
    const [kelasIndukId, setKelasIndukId] = useState('');

    // ===== Tahun ajaran (default ke yang Aktif) =====
    const { data: tahunAjaranData, isLoading: isLoadingTahunAjaran } = useSeeAllTahunAjaranQuery();
    const tahunAjaranList = useMemo(() => tahunAjaranData?.data ?? [], [tahunAjaranData]);
    const defaultTahunAjaranId = useMemo(() => {
        const tahunAktif = tahunAjaranList.find((tahun) => tahun.status === 'Aktif');
        return (tahunAktif ?? tahunAjaranList[0])?.id ?? '';
    }, [tahunAjaranList]);
    const activeTahunAjaranId = tahunAjaranId || defaultTahunAjaranId;

    // ===== Semua kelas dalam tahun ajaran (dipakai kedua mode) =====
    const { data: kelasData, isLoading: isLoadingKelas } = useGetKelasByTahunAjaranQuery(activeTahunAjaranId, {
        skip: !activeTahunAjaranId,
    });
    const allKelasList = useMemo(() => kelasData?.data ?? [], [kelasData]);

    // ===== Kelas Induk untuk mode "Ranking Angkatan" =====
    const { data: kelasIndukData, isLoading: isLoadingKelasInduk } = useSeeAllKelasIndukQuery(undefined, {
        skip: mode !== 'angkatan',
    });
    const kelasIndukList = useMemo(() => kelasIndukData?.data ?? [], [kelasIndukData]);
    const kelasIndukMasihAda = kelasIndukList.some((k) => k.id === kelasIndukId);
    const activeKelasIndukId = kelasIndukMasihAda ? kelasIndukId : (kelasIndukList[0]?.id ?? '');

    // ===== Daftar kelas yang ditampilkan tergantung mode =====
    // Mode kelas: semua kelas dalam tahun ajaran (scope perhitungan)
    // Mode angkatan: hanya kelas yang berada di bawah kelas induk terpilih (filter tampilan, opsional)
    const kelasList = useMemo(() => {
        if (mode === 'kelas') return allKelasList;
        if (!activeKelasIndukId) return [];
        return allKelasList.filter((kelas) => kelas.kelasInduk?.id === activeKelasIndukId);
    }, [mode, allKelasList, activeKelasIndukId]);

    const kelasMasihAda = kelasList.some((kelas) => kelas.id === kelasId);
    // Mode kelas: wajib ada kelas terpilih (default ke kelas pertama)
    // Mode angkatan: kelas bersifat opsional — biarkan kosong berarti "semua kelas dalam angkatan ini"
    const activeKelasId = mode === 'kelas' ? (kelasMasihAda ? kelasId : (kelasList[0]?.id ?? '')) : (kelasMasihAda ? kelasId : '');

    // ===== Ranking dari backend =====
    const {
        data: rankingKelasData,
        isFetching: isFetchingRankingKelas,
        isError: isErrorRankingKelas,
    } = useSeeRankingKelasQuery(
        { tahunAjaranId: activeTahunAjaranId, kelasId: activeKelasId },
        { skip: mode !== 'kelas' || !activeTahunAjaranId || !activeKelasId },
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
        // TAPI peringkat yang ditampilkan tetap peringkat asli se-angkatan (tidak dihitung ulang)
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

    const topThree = rankingData.slice(0, 3);
    const rest = rankingData.slice(3);

    const isLoadingFilterList = mode === 'kelas' ? isLoadingKelas : isLoadingKelasInduk;
    const isFilterReady = mode === 'kelas' ? allKelasList.length > 0 : kelasIndukList.length > 0;
    const filterEmptyMessage =
        mode === 'kelas' ? 'Tidak ada kelas pada tahun ajaran ini.' : 'Belum ada data kelas induk (angkatan).';

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
            <div className="absolute top-3 right-3 sm:top-5 sm:right-5 md:top-6 md:right-8 z-10">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                    <FaSignInAlt />
                    Login
                </Link>
            </div>
            {/* HERO */}
            <section className="px-4 sm:px-6 pt-24 sm:pt-16 pb-8 text-center">
                <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 sm:px-4 py-1.5 text-xs font-semibold text-blue-700">
                    <FaChartLine />
                    Hasil Perhitungan Metode SMART
                </div>
                <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    Peringkat Siswa Terbaik
                </h1>
                <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
                    Daftar siswa dengan nilai akhir tertinggi berdasarkan hasil perhitungan SMART (Simple Multi
                    Attribute Rating Technique).
                </p>
                {selectedTahunAjaran && (
                    <p className="mt-1 text-sm text-gray-400">Tahun Ajaran {selectedTahunAjaran.namaTahunAjaran}</p>
                )}

                {/* FILTER + TOGGLE */}
                <div className="mt-6 flex flex-col items-center gap-3">
                    <div className="inline-flex w-full max-w-xs sm:w-auto sm:max-w-none rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                        <button
                            type="button"
                            onClick={() => {
                                setMode('kelas');
                                setKelasId('');
                            }}
                            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                                mode === 'kelas'
                                    ? 'bg-blue-600 text-white shadow-sm'
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
                            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                                mode === 'angkatan'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            <FaUsers />
                            Ranking Angkatan
                        </button>
                    </div>

                    <div className="flex flex-col xs:flex-row sm:flex-row items-center justify-center gap-2 w-full max-w-xs sm:max-w-none sm:w-auto flex-wrap">
                        <select
                            value={activeTahunAjaranId}
                            onChange={(event) => {
                                setTahunAjaranId(event.target.value);
                                setKelasId('');
                                setKelasIndukId('');
                            }}
                            className="w-full sm:w-auto rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">Pilih tahun ajaran</option>
                            {tahunAjaranList.map((tahun) => (
                                <option key={tahun.id} value={tahun.id}>
                                    {tahun.namaTahunAjaran} - {tahun.status}
                                </option>
                            ))}
                        </select>

                        {mode === 'angkatan' && (
                            <select
                                value={activeKelasIndukId}
                                onChange={(event) => {
                                    setKelasIndukId(event.target.value);
                                    setKelasId(''); // reset kelas saat kelas induk berganti
                                }}
                                disabled={isLoadingKelasInduk || kelasIndukList.length === 0}
                                className="w-full sm:w-auto rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:text-gray-400"
                            >
                                <option value="">
                                    {isLoadingKelasInduk ? 'Memuat angkatan...' : 'Pilih angkatan (kelas induk)'}
                                </option>
                                {kelasIndukList.map((k) => (
                                    <option key={k.id} value={k.id}>
                                        {k.namaKelasInduk}
                                    </option>
                                ))}
                            </select>
                        )}

                        <select
                            value={activeKelasId}
                            onChange={(event) => setKelasId(event.target.value)}
                            disabled={
                                mode === 'kelas'
                                    ? !activeTahunAjaranId || isLoadingKelas || kelasList.length === 0
                                    : !activeKelasIndukId || isLoadingKelas || kelasList.length === 0
                            }
                            className="w-full sm:w-auto rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:text-gray-400"
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
                    </div>
                </div>
            </section>

            {/* STATE: loading / error / empty */}
            {(isLoadingTahunAjaran || isLoadingRanking) && (
                <p className="text-center text-gray-400 py-16 text-sm px-4">Memuat ranking...</p>
            )}

            {!isLoadingTahunAjaran && !isLoadingRanking && isErrorRanking && (
                <p className="text-center text-red-400 py-16 text-sm px-4">Gagal memuat ranking</p>
            )}

            {!isLoadingTahunAjaran && !isLoadingRanking && !isErrorRanking && !activeTahunAjaranId && (
                <p className="text-center text-gray-400 py-16 text-sm px-4">Pilih tahun ajaran terlebih dahulu</p>
            )}

            {!isLoadingTahunAjaran &&
                !isLoadingRanking &&
                !isErrorRanking &&
                activeTahunAjaranId &&
                mode === 'angkatan' &&
                !isLoadingKelasInduk &&
                !isFilterReady && (
                    <p className="text-center text-gray-400 py-16 text-sm px-4">{filterEmptyMessage}</p>
                )}

            {!isLoadingTahunAjaran &&
                !isLoadingRanking &&
                !isErrorRanking &&
                activeTahunAjaranId &&
                mode === 'kelas' &&
                allKelasList.length === 0 && (
                    <p className="text-center text-gray-400 py-16 text-sm px-4">{filterEmptyMessage}</p>
                )}

            {!isLoadingTahunAjaran &&
                !isLoadingRanking &&
                !isErrorRanking &&
                activeTahunAjaranId &&
                ((mode === 'kelas' && allKelasList.length > 0) ||
                    (mode === 'angkatan' && activeKelasIndukId)) &&
                rankingData.length === 0 && (
                    <p className="text-center text-gray-400 py-16 text-sm px-4">{EMPTY_MESSAGE}</p>
                )}

            {/* PODIUM TOP 3 */}
            {topThree.length > 0 && (
                <section className="px-4 sm:px-6 pb-12">
                    <div className="mx-auto max-w-4xl flex flex-col md:flex-row md:items-end justify-center gap-3 sm:gap-4">
                        {topThree.map((ranking) => {
                            const style = PODIUM_STYLE[ranking.peringkat] ?? PODIUM_STYLE[3];
                            return (
                                <div
                                    key={ranking.id}
                                    className={`flex-1 ${style.order} rounded-2xl bg-white border border-gray-100 shadow-md p-4 sm:p-5 flex flex-col items-center text-center ${style.height}`}
                                >
                                    <div
                                        className={`h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-blue-50 flex items-center justify-center ${style.ring}`}
                                    >
                                        {style.icon}
                                    </div>
                                    <span
                                        className={`mt-3 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${style.badge}`}
                                    >
                                        {ranking.peringkat}
                                    </span>
                                    <p className="mt-2 font-semibold text-gray-900 text-sm sm:text-base break-words">
                                        {ranking.siswa?.namaSiswa ?? '-'}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {getKelasLabel(ranking)} · NIS {ranking.siswa?.nis ?? '-'}
                                    </p>
                                    <p className="mt-2 text-lg sm:text-xl font-bold text-blue-600">
                                        {formatNilai(ranking.nilaiAkhir)}
                                    </p>
                                    <p className="text-[11px] text-gray-400">Nilai Akhir SMART</p>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* TABEL SISANYA */}
            {rest.length > 0 && (
                <section className="px-4 sm:px-6 pb-16">
                    <div className="mx-auto max-w-4xl bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-4 sm:px-5 py-4 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-800 text-sm sm:text-base">Peringkat Lainnya</h2>
                            <p className="text-xs text-gray-400">
                                Menampilkan {rankingData.length} siswa{' '}
                                {mode === 'angkatan' ? 'se-angkatan' : 'dalam kelas'}
                            </p>
                        </div>

                        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                            <table className="w-full min-w-[560px] text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                                            Peringkat
                                        </th>
                                        <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                                            Nama Siswa
                                        </th>
                                        <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                                            NIS
                                        </th>
                                        <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                                            Kelas
                                        </th>
                                        <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                                            Nilai Akhir
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {rest.map((ranking) => (
                                        <tr key={ranking.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 sm:px-5 py-3 font-medium text-gray-700 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-2">
                                                    <FaTrophy className="text-gray-300" />
                                                    {ranking.peringkat ?? '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-5 py-3 font-medium text-gray-800 whitespace-nowrap">
                                                {ranking.siswa?.namaSiswa ?? '-'}
                                            </td>
                                            <td className="px-4 sm:px-5 py-3 text-gray-500 whitespace-nowrap">
                                                {ranking.siswa?.nis ?? '-'}
                                            </td>
                                            <td className="px-4 sm:px-5 py-3">
                                                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 whitespace-nowrap">
                                                    {getKelasLabel(ranking)}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-5 py-3 font-semibold text-gray-900 whitespace-nowrap">
                                                {formatNilai(ranking.nilaiAkhir)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}