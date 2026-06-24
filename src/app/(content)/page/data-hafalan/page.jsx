'use client';

import { siswaAPI, useSeeAllSiswaByHafalanQuery } from '@/src/hooks/api/siswaSliceAPI';
import HafalanCard from '@/src/app/conponents/card/hafalanCard';
import EditModal from '@/src/app/conponents/modal/crud/editModal';
import { useState } from 'react';
import FormEditHafalan from '@/src/app/conponents/form/crud/edit-data/hafalan';
import { useDispatch } from 'react-redux';

export default function SiswaHafalanPage() {
    const dispatch = useDispatch();
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
        <div className="min-h-screen bg-[#F8F5EE] px-4 py-10 sm:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <p className="text-xs font-medium uppercase tracking-widest text-[#C99B4B]">Rekap Tahfidz</p>
                    <h1 className="font-serif text-3xl text-stone-800">Data Hafalan Siswa</h1>
                </div>

                {isLoading && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-40 animate-pulse rounded-xl border border-stone-200 bg-white" />
                        ))}
                    </div>
                )}

                {isError && (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
                        {error?.data?.message ?? 'Gagal mengambil data. Coba muat ulang halaman.'}
                    </div>
                )}

                {!isLoading && !isError && data.length === 0 && (
                    <div className="rounded-xl border border-dashed border-stone-300 bg-white px-5 py-12 text-center">
                        <p className="font-serif text-lg text-stone-700">Belum ada data siswa</p>
                        <p className="mt-1 text-sm text-stone-400">
                            Data akan muncul di sini setelah siswa ditambahkan.
                        </p>
                    </div>
                )}

                {!isLoading && !isError && data.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {data.map((siswa) => (
                            <HafalanCard key={siswa.id} siswa={siswa} onEdit={handleEdit} />
                        ))}
                    </div>
                )}
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
