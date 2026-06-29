'use client';

import { useMemo, useState } from 'react';
import { FaCrown, FaMedal, FaTrophy, FaLayerGroup, FaUsers, FaChartLine, FaSignInAlt } from 'react-icons/fa';
import { useGetKelasByTahunAjaranQuery } from '@/src/hooks/api/kelasSliceAPI';
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
        icon: <FaCrown className="text-yellow-400 text-3xl" />,
        ring: 'ring-4 ring-yellow-300',
        badge: 'bg-yellow-400 text-yellow-900',
        order: 'md:order-2',
        height: 'md:h-56',
    },
    2: {
        icon: <FaMedal className="text-gray-300 text-2xl" />,
        ring: 'ring-4 ring-gray-200',
        badge: 'bg-gray-300 text-gray-700',
        order: 'md:order-1',
        height: 'md:h-44',
    },
    3: {
        icon: <FaMedal className="text-amber-500 text-2xl" />,
        ring: 'ring-4 ring-amber-200',
        badge: 'bg-amber-400 text-amber-900',
        order: 'md:order-3',
        height: 'md:h-36',
    },
};

export default function RankingLandingPage() {
    const [mode, setMode] = useState('angkatan');
    const [tahunAjaranId, setTahunAjaranId] = useState('');
    const [kelasId, setKelasId] = useState('');

    // ===== Tahun ajaran (default ke yang Aktif) =====
    const { data: tahunAjaranData, isLoading: isLoadingTahunAjaran } = useSeeAllTahunAjaranQuery();
    const tahunAjaranList = useMemo(() => tahunAjaranData?.data ?? [], [tahunAjaranData]);
    const defaultTahunAjaranId = useMemo(() => {
        const tahunAktif = tahunAjaranList.find((tahun) => tahun.status === 'Aktif');
        return (tahunAktif ?? tahunAjaranList[0])?.id ?? '';
    }, [tahunAjaranList]);
    const activeTahunAjaranId = tahunAjaranId || defaultTahunAjaranId;

    // ===== Semua kelas untuk mode "Ranking Kelas" (tidak difilter ke tingkat tertentu) =====
    const { data: kelasData, isLoading: isLoadingKelas } = useGetKelasByTahunAjaranQuery(activeTahunAjaranId, {
        skip: !activeTahunAjaranId,
    });
    const kelasList = useMemo(() => kelasData?.data ?? [], [kelasData]);
    const kelasMasihAda = kelasList.some((kelas) => kelas.id === kelasId);
    const activeKelasId = kelasMasihAda ? kelasId : (kelasList[0]?.id ?? '');

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
    } = useSeeRankingAngkatanQuery(activeTahunAjaranId, {
        skip: mode !== 'angkatan' || !activeTahunAjaranId,
    });

    const rankingSource = mode === 'kelas' ? rankingKelasData?.data : rankingAngkatanData?.data;
    const rankingData = useMemo(() => {
        const data = rankingSource ?? [];

        // Tidak ada lagi filter kelas tertentu — tampilkan semua data dari backend
        return data
            .slice()
            .sort((a, b) => (a.peringkat ?? Number.MAX_SAFE_INTEGER) - (b.peringkat ?? Number.MAX_SAFE_INTEGER));
    }, [rankingSource]);

    const isLoadingRanking = mode === 'kelas' ? isFetchingRankingKelas : isFetchingRankingAngkatan;
    const isErrorRanking = mode === 'kelas' ? isErrorRankingKelas : isErrorRankingAngkatan;
    const selectedTahunAjaran = tahunAjaranList.find((tahun) => tahun.id === activeTahunAjaranId);

    const topThree = rankingData.slice(0, 3);
    const rest = rankingData.slice(3);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
            <div className="absolute top-5 right-5 md:top-6 md:right-8 z-10">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                    <FaSignInAlt />
                    Login
                </Link>
            </div>
            {/* HERO */}
            <section className="px-6 pt-16 pb-8 text-center">
                <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-xs font-semibold text-blue-700">
                    <FaChartLine />
                    Hasil Perhitungan Metode SMART
                </div>
                <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">Peringkat Siswa Terbaik</h1>
                <p className="mt-2 text-gray-500 max-w-xl mx-auto">
                    Daftar siswa dengan nilai akhir tertinggi berdasarkan hasil perhitungan SMART (Simple Multi
                    Attribute Rating Technique).
                </p>
                {selectedTahunAjaran && (
                    <p className="mt-1 text-sm text-gray-400">Tahun Ajaran {selectedTahunAjaran.namaTahunAjaran}</p>
                )}

                {/* FILTER + TOGGLE */}
                <div className="mt-6 flex flex-col items-center gap-3">
                    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                        <button
                            type="button"
                            onClick={() => setMode('kelas')}
                            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
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
                            onClick={() => setMode('angkatan')}
                            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                                mode === 'angkatan'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            <FaUsers />
                            Ranking Angkatan
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <select
                            value={activeTahunAjaranId}
                            onChange={(event) => {
                                setTahunAjaranId(event.target.value);
                                setKelasId('');
                            }}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">Pilih tahun ajaran</option>
                            {tahunAjaranList.map((tahun) => (
                                <option key={tahun.id} value={tahun.id}>
                                    {tahun.namaTahunAjaran} - {tahun.status}
                                </option>
                            ))}
                        </select>

                        {mode === 'kelas' && (
                            <select
                                value={activeKelasId}
                                onChange={(event) => setKelasId(event.target.value)}
                                disabled={!activeTahunAjaranId || isLoadingKelas || kelasList.length === 0}
                                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:text-gray-400"
                            >
                                <option value="">{isLoadingKelas ? 'Memuat kelas...' : 'Pilih kelas'}</option>
                                {kelasList.map((kelas) => (
                                    <option key={kelas.id} value={kelas.id}>
                                        {kelas.kodeKelas} - {kelas.namaKelas}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </section>

            {/* STATE: loading / error / empty */}
            {(isLoadingTahunAjaran || isLoadingRanking) && (
                <p className="text-center text-gray-400 py-16 text-sm">Memuat ranking...</p>
            )}

            {!isLoadingTahunAjaran && !isLoadingRanking && isErrorRanking && (
                <p className="text-center text-red-400 py-16 text-sm">Gagal memuat ranking</p>
            )}

            {!isLoadingTahunAjaran && !isLoadingRanking && !isErrorRanking && !activeTahunAjaranId && (
                <p className="text-center text-gray-400 py-16 text-sm">Pilih tahun ajaran terlebih dahulu</p>
            )}

            {!isLoadingTahunAjaran &&
                !isLoadingRanking &&
                !isErrorRanking &&
                activeTahunAjaranId &&
                mode === 'kelas' &&
                kelasList.length === 0 && (
                    <p className="text-center text-gray-400 py-16 text-sm">Tidak ada kelas pada tahun ajaran ini.</p>
                )}

            {!isLoadingTahunAjaran &&
                !isLoadingRanking &&
                !isErrorRanking &&
                activeTahunAjaranId &&
                (mode === 'angkatan' || kelasList.length > 0) &&
                rankingData.length === 0 && <p className="text-center text-gray-400 py-16 text-sm">{EMPTY_MESSAGE}</p>}

            {/* PODIUM TOP 3 */}
            {topThree.length > 0 && (
                <section className="px-6 pb-12">
                    <div className="mx-auto max-w-4xl flex flex-col md:flex-row md:items-end justify-center gap-4">
                        {topThree.map((ranking) => {
                            const style = PODIUM_STYLE[ranking.peringkat] ?? PODIUM_STYLE[3];
                            return (
                                <div
                                    key={ranking.id}
                                    className={`flex-1 ${style.order} rounded-2xl bg-white border border-gray-100 shadow-md p-5 flex flex-col items-center text-center ${style.height}`}
                                >
                                    <div
                                        className={`h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center ${style.ring}`}
                                    >
                                        {style.icon}
                                    </div>
                                    <span
                                        className={`mt-3 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${style.badge}`}
                                    >
                                        {ranking.peringkat}
                                    </span>
                                    <p className="mt-2 font-semibold text-gray-900">
                                        {ranking.siswa?.namaSiswa ?? '-'}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {getKelasLabel(ranking)} · NIS {ranking.siswa?.nis ?? '-'}
                                    </p>
                                    <p className="mt-2 text-xl font-bold text-blue-600">
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
                <section className="px-6 pb-16">
                    <div className="mx-auto max-w-4xl bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-800">Peringkat Lainnya</h2>
                            <p className="text-xs text-gray-400">
                                Menampilkan {rankingData.length} siswa{' '}
                                {mode === 'angkatan' ? 'se-angkatan' : 'dalam kelas'}
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
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
                                            Nilai Akhir
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {rest.map((ranking) => (
                                        <tr key={ranking.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3 font-medium text-gray-700">
                                                <span className="inline-flex items-center gap-2">
                                                    <FaTrophy className="text-gray-300" />
                                                    {ranking.peringkat ?? '-'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 font-medium text-gray-800">
                                                {ranking.siswa?.namaSiswa ?? '-'}
                                            </td>
                                            <td className="px-5 py-3 text-gray-500">{ranking.siswa?.nis ?? '-'}</td>
                                            <td className="px-5 py-3">
                                                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                                    {getKelasLabel(ranking)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 font-semibold text-gray-900">
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
