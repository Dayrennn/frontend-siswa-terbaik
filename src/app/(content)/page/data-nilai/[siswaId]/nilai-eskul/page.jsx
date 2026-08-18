'use client';

import { siswaAPI, useGetSiswaByIdQuery } from '@/src/hooks/api/siswaSliceAPI';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import EditModal from '@/src/app/conponents/modal/crud/editModal';
import { FaUserPlus } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import EskulCard from '@/src/app/conponents/card/nilaiEskulCard';
import FormEditNilaiEskul from '@/src/app/conponents/form/crud/edit-data/nilaiEskul';

export default function DetailNilaiSiswa() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { siswaId } = useParams();
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSiswa, setSelectedSiswa] = useState(null);
    const { data, isLoading, isError } = useGetSiswaByIdQuery(siswaId);
    const siswa = data?.data;

    if (isLoading) return <p className="text-center text-gray-400 py-12 text-sm">Memuat data...</p>;
    if (isError || !siswa) return <p className="text-center text-red-400 py-12 text-sm">Gagal memuat data</p>;

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
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="mx-auto max-w-4xl">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-4 sm:mb-5 transition-colors"
                >
                    ← Kembali
                </button>

                {/* Header Siswa */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 mb-4 sm:mb-5 flex items-center gap-3 sm:gap-4 flex-wrap">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-sm sm:text-base shrink-0">
                        {inisial}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{siswa.namaSiswa}</p>
                        <div className="flex gap-2 mt-1 flex-wrap">
                            <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                                Kelas {siswa.kelas?.kodeKelas} · {siswa.kelas?.namaKelas}
                            </span>
                        </div>
                    </div>
                </div>

                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Rekap per pelajaran</p>

                <div className="flex flex-col gap-2.5 sm:gap-3">
                    {siswa.nilaiEskulRekap.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">Belum ada data nilai</p>
                    ) : (
                        siswa.nilaiEskulRekap.map((rekap) => (
                            <EskulCard key={rekap.id} rekap={rekap} siswaId={siswa.id} onEdit={handleEdit} />
                        ))
                    )}
                </div>
            </div>
            {showEditModal && (
                <EditModal
                    onCancel={() => setShowEditModal(false)}
                    icon={<FaUserPlus />}
                    title="Edit Absen"
                    formEdit={FormEditNilaiEskul}
                    initialData={selectedSiswa}
                    successTitle="Absen Berhasil di Update"
                    successMessage="Berhasil"
                    onAfterSuccess={handleAfterSuccess}
                />
            )}
        </div>
    );
}
