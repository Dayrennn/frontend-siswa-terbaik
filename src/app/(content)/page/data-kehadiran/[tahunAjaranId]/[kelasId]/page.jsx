'use client';

import { useParams } from 'next/navigation';

import { useSeeAllPertemuanByTahunAndKelasQuery } from '../../../../../../hooks/api/pertemuanSliceAPI';
import { useGetKelasByIdQuery } from '../../../../../../hooks/api/kelasSliceAPI';
import PertemuanCard from '../../../../../conponents/card/pertemuanCard';
import { useState } from 'react';
import CreateModal from '../../../../../conponents/modal/crud/createModal';
import { FaUserPlus } from 'react-icons/fa';
import FormTambahPertemuan from '../../../../../conponents/form/crud/tambah-data/pertemuan';

export default function Pertemuan() {
    const { tahunAjaranId, kelasId } = useParams();
    const { data } = useSeeAllPertemuanByTahunAndKelasQuery({
        tahunAjaranId,
        kelasId,
    });
    const { data: kodeKelas } = useGetKelasByIdQuery(kelasId);

    // modal
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <>
            <div className='min-h-screen bg-gray-100 '>
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
                    {data?.data?.map((pertemuan) => (
                        <PertemuanCard key={pertemuan.id} namaPertemuan={pertemuan.namaPertemuan} />
                    ))}
                </div>
            </div>
            {showCreateModal && (
                <CreateModal
                    onCancel={() => setShowCreateModal(false)}
                    icon={<FaUserPlus />}
                    title={'Tambah Pertemuan'}
                    formTambah={FormTambahPertemuan}
                    successTitle='Pertemuan Berhasil Dibuat'
                    successMessage='Berhasil'
                />
            )}
        </>
    );
}
