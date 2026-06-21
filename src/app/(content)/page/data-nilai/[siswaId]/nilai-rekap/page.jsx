'use client';

import { siswaAPI, useGetSiswaByIdQuery } from '@/src/hooks/api/siswaSliceAPI';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import EditModal from '@/src/app/conponents/modal/crud/editModal';
import { FaUserPlus } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import NilaiCard from '@/src/app/conponents/card/nilaiCard';
import FormEditNilai from '@/src/app/conponents/form/crud/edit-data/nilai';

export default function DetailNilaiSiswa() {
    const dispatch = useDispatch();
    const { siswaId } = useParams();
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSiswa, setSelectedSiswa] = useState(null);
    const { data, isLoading, isError } = useGetSiswaByIdQuery(siswaId);
    const siswa = data?.data;

    if (isLoading) return <p className="text-center text-gray-400 py-12 text-sm">Memuat data...</p>;
    if (isError || !siswa) return <p className="text-center text-red-400 py-12 text-sm">Gagal memuat data</p>;

    const { ringkasan } = siswa;
    const inisial = siswa.namaSiswa
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('');

    const handleEdit = (siswa) => {
        setSelectedSiswa(siswa);
        setShowEditModal(true);
    };

    const handleAfterSuccess = () => {
        dispatch(siswaAPI.util.invalidateTags(['siswaAPI']));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-4xl">
                <Link
                    href="/page/data-absen"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-5 transition-colors"
                >
                    ← Kembali
                </Link>

                {/* Header Siswa */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-5 flex items-center gap-4 flex-wrap">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-base shrink-0">
                        {inisial}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-base">{siswa.namaSiswa}</p>
                        <div className="flex gap-2 mt-1 flex-wrap">
                            <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">
                                Kelas {siswa.kelas?.kodeKelas} · {siswa.kelas?.namaKelas}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-6 text-center ml-auto">
                        <div>
                            <p className="text-xl font-medium text-gray-900">{ringkasan.rataRataNilai}</p>
                            <p className="text-xs text-gray-400">Rata-rata Nilai</p>
                        </div>
                    </div>
                </div>

                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Rekap per pelajaran</p>

                <div className="flex flex-col gap-3">
                    {siswa.nilaiRekap.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">Belum ada data nilai</p>
                    ) : (
                        siswa.nilaiRekap.map((rekap) => (
                            <NilaiCard key={rekap.id} rekap={rekap} siswaId={siswa.id} onEdit={handleEdit} />
                        ))
                    )}
                </div>
            </div>
            {showEditModal && (
                <EditModal
                    onCancel={() => setShowEditModal(false)}
                    icon={<FaUserPlus />}
                    title="Edit Absen"
                    formEdit={FormEditNilai}
                    initialData={selectedSiswa}
                    successTitle="Absen Berhasil di Update"
                    successMessage="Berhasil"
                    onAfterSuccess={handleAfterSuccess}
                />
            )}
        </div>
    );
}
