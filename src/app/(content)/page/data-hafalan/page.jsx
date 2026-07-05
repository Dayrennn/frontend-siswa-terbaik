'use client';

import { siswaAPI, useSeeAllSiswaByHafalanQuery } from '@/src/hooks/api/siswaSliceAPI';
import HafalanCard from '@/src/app/conponents/card/hafalanCard';
import EditModal from '@/src/app/conponents/modal/crud/editModal';
import { useState } from 'react';
import FormEditHafalan from '@/src/app/conponents/form/crud/edit-data/hafalan';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@/src/hooks/api/authSliceAPI';

export default function SiswaHafalanPage() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    const [showEditModal, setShowEditModal] = useState(false);

    const { data: siswaList, isLoading, isError, error } = useSeeAllSiswaByHafalanQuery();
    const data = siswaList?.data ?? [];

    const [selectedSiswa, setSelectedSiswa] = useState(null);
    const handleEdit = (siswa) => {
        setSelectedSiswa(siswa);
        setShowEditModal(true);
    };

    const handleAfterSuccess = () => {
        dispatch(siswaAPI.util.invalidateTags(['siswaAPI']));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-4 sm:mb-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Rekap Tahfidz</p>
                    <h1 className="text-lg sm:text-xl font-medium text-gray-900">Data Hafalan Siswa</h1>
                    <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Rekap hafalan tahfidz seluruh siswa</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-5">
                    {isLoading && (
                        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-40 animate-pulse rounded-xl border border-gray-100 bg-gray-50"
                                />
                            ))}
                        </div>
                    )}

                    {isError && (
                        <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-500">
                            {error?.data?.message ?? 'Gagal mengambil data. Coba muat ulang halaman.'}
                        </div>
                    )}

                    {!isLoading && !isError && data.length === 0 && (
                        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-5 py-12 text-center">
                            <p className="text-base sm:text-lg font-medium text-gray-700">Belum ada data siswa</p>
                            <p className="mt-1 text-xs sm:text-sm text-gray-400">
                                Data akan muncul di sini setelah siswa ditambahkan.
                            </p>
                        </div>
                    )}

                    {!isLoading && !isError && data.length > 0 && (
                        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {data.map((siswa) => (
                                <HafalanCard key={siswa.id} siswa={siswa} onEdit={handleEdit} user={user} />
                            ))}
                        </div>
                    )}

                    {/* Footer */}
                    {!isLoading && !isError && data.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400">{data.length} siswa ditampilkan</p>
                        </div>
                    )}
                </div>
            </div>
            {showEditModal && (
                <EditModal
                    onCancel={() => setShowEditModal(false)}
                    title={'Edit Hafalan'}
                    formEdit={FormEditHafalan}
                    initialData={selectedSiswa}
                    successTitle={'Berhasil'}
                    successMessage={'Berhasil Edit Hafalan'}
                    onAfterSuccess={handleAfterSuccess}
                />
            )}
        </div>
    );
}
