'use client';

import { useSeeOneSiswaHafalanQuery, siswaAPI } from '@/src/hooks/api/siswaSliceAPI';
import EditModal from '@/src/app/conponents/modal/crud/editModal';
import FormEditHafalan from '@/src/app/conponents/form/crud/edit-data/hafalan';
import { useSelector, useDispatch } from 'react-redux';
import { PencilIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { selectUser } from '@/src/hooks/api/authSliceAPI';

export default function SiswaSatuHafalan() {
    const { siswaId, tahunAjaranId, kelasId } = useParams();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const isAdmin = user?.role === 'Admin';
    const isWakilKepalaSekolah = user?.role === 'WakilKepalaSekolah';
    const isKepalaSekolah = user?.role === 'KepalaSekolah';
    const canEdit = isAdmin || isWakilKepalaSekolah || isKepalaSekolah;

    const { data, isLoading, isError, error } = useSeeOneSiswaHafalanQuery({ siswaId, tahunAjaranId, kelasId });
    const siswa = data?.data;

    const [showEditModal, setShowEditModal] = useState(false);

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleAfterSuccess = () => {
        dispatch(siswaAPI.util.invalidateTags(['siswaAPI']));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-4 sm:mb-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Rekap Tahfidz</p>
                    <h1 className="text-lg sm:text-xl font-medium text-gray-900">Data Hafalan Siswa</h1>
                    <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Rekap hafalan tahfidz {siswa?.namaSiswa}</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    {isLoading && <p className="text-center text-gray-400 py-12 text-sm">Memuat data...</p>}

                    {isError && (
                        <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-400">
                            {error?.data?.message ?? 'Gagal mengambil data. Coba muat ulang halaman.'}
                        </div>
                    )}

                    {!isLoading && !isError && siswa && (
                        <div className="flex items-start justify-between flex-wrap gap-4">
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-base">{siswa.namaSiswa}</p>
                                <p className="text-xs text-gray-400 mt-0.5">NIS {siswa.nis}</p>

                                <div className="flex gap-2 mt-2 flex-wrap">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                        {siswa.kelas ? `${siswa.kelas.kodeKelas} · ${siswa.kelas.namaKelas}` : '-'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {siswa.tahunAjaran?.namaTahunAjaran || '-'}
                                    </span>
                                </div>

                                <div className="mt-4">
                                    {siswa.hafalan ? (
                                        <>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                                                {siswa.hafalan.jumlahJuz} Juz
                                            </span>
                                            <p className="text-sm text-gray-500 mt-2">
                                                {siswa.hafalan.keterangan || '-'}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-xs text-gray-400">Belum ada catatan hafalan</p>
                                    )}
                                </div>
                            </div>

                            {canEdit && (
                                <button
                                    type="button"
                                    onClick={handleEdit}
                                    className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium cursor-pointer shrink-0"
                                >
                                    <PencilIcon className="h-3.5 w-3.5" />
                                    Edit
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showEditModal && (
                <EditModal
                    onCancel={() => setShowEditModal(false)}
                    title={'Edit Hafalan'}
                    formEdit={FormEditHafalan}
                    initialData={siswa}
                    successTitle={'Berhasil'}
                    successMessage={'Berhasil Edit Hafalan'}
                    onAfterSuccess={handleAfterSuccess}
                />
            )}
        </div>
    );
}
