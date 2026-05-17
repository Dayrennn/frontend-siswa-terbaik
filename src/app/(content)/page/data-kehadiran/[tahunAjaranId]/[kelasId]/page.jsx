'use client';

import { useParams } from 'next/navigation';
import { useSeeAllPertemuanByTahunAndKelasQuery, useRemovePertemuanMutation } from '../../../../../../hooks/api/pertemuanSliceAPI';
import { useGetKelasByIdQuery } from '../../../../../../hooks/api/kelasSliceAPI';
import PertemuanCard from '../../../../../conponents/card/pertemuanCard';
import { useState } from 'react';
import CreateModal from '../../../../../conponents/modal/crud/createModal';
import RemoveModal from '../../../../../conponents/modal/crud/deleteModal';
import { FaUserPlus } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import FormTambahPertemuan from '../../../../../conponents/form/crud/tambah-data/pertemuan';

export default function Pertemuan() {
    const { tahunAjaranId, kelasId } = useParams();
    const { data } = useSeeAllPertemuanByTahunAndKelasQuery({ tahunAjaranId, kelasId });
    const { data: kodeKelas } = useGetKelasByIdQuery(kelasId);
    const [removePertemuan] = useRemovePertemuanMutation();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPertemuan, setSelectedPertemuan] = useState(null);

    const handleDelete = async (id) => {
        await removePertemuan(id).unwrap();
    };

    return (
        <>
            <div className='min-h-screen bg-gray-100'>
                <div className='mx-auto max-w-7xl bg-white p-6 shadow-md rounded-xl'>
                    <h1 className='text-2xl font-bold text-gray-800'>
                        Kelas {kodeKelas?.data?.kodeKelas || 'Loading...'}
                    </h1>
                    <div className='flex justify-end mt-5 mb-3'>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className='text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors'
                        >
                            + Tambah
                        </button>
                    </div>
                    {data?.data?.length === 0 ? (
                        <div className='flex flex-col items-center justify-center py-16 text-gray-400'>
                            <p className='text-lg font-medium'>Belum ada pertemuan</p>
                            <p className='text-sm mt-1'>Klik tombol <span className='font-semibold'>+ Tambah</span> untuk membuat pertemuan baru</p>
                        </div>
                    ) : (
                        data?.data?.map((pertemuan) => (
                            <PertemuanCard
                                key={pertemuan.id}
                                namaPertemuan={pertemuan.namaPertemuan}
                                onDelete={() => {
                                    setSelectedPertemuan(pertemuan);
                                    setShowDeleteModal(true);
                                }}
                                nomorUrut={pertemuan.nomorUrut}
                                customHref={`/page/data-kehadiran/${tahunAjaranId}/${kelasId}/absen/${pertemuan.id}`}
                            />
                        ))
                    )}
                </div>
            </div>

            {showCreateModal && (
                <CreateModal
                    onCancel={() => setShowCreateModal(false)}
                    icon={<FaUserPlus />}
                    title='Tambah Pertemuan'
                    formTambah={FormTambahPertemuan}
                    successTitle='Pertemuan Berhasil Dibuat'
                    successMessage='Berhasil'
                    tahunAjaranId={tahunAjaranId}
                    kelasId={kelasId}
                />
            )}

            {showDeleteModal && (
                <RemoveModal
                    onCancel={() => {
                        setShowDeleteModal(false);
                        setSelectedPertemuan(null);
                    }}
                    icon={<FaTrash />}
                    title='Hapus Pertemuan'
                    successTitle='Pertemuan Berhasil Dihapus'
                    successMessage='Data pertemuan telah dihapus'
                    initialData={selectedPertemuan}
                    displayName='namaPertemuan'
                    onConfirm={handleDelete}
                />
            )}
        </>
    );
}