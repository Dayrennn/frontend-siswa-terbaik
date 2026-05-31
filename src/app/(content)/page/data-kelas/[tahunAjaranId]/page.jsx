'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

import Table from '../../../../conponents/table/page';
import Link from 'next/link';

import { useGetAllKelasQuery } from '../../../../../hooks/api/kelasSliceAPI';
import { useGetTahunAjaranByIdQuery } from '../../../../../hooks/api/tahunAjaranSliceAPI';

export default function DataKehadiranByTahunAjaran() {
    const { tahunAjaranId } = useParams();
    const [search, setSearch] = useState('');

    const { data, isLoading, isError } = useGetAllKelasQuery();
    const { data: tahunAjaranData } = useGetTahunAjaranByIdQuery(tahunAjaranId);

    const kelasData =
        data?.data?.map((item, index) => {
            return {
                no: index + 1,
                ...item,
            };
        }) ?? [];

    const columns = [
        { key: 'no', label: 'No' },
        {
            key: 'kodeKelas',
            label: 'Kode Kelas',
            render: (row) => <span className='text-gray-700'>{row.kodeKelas || '-'}</span>,
        },
        {
            key: 'namaKelas',
            label: 'Nama Kelas',
            render: (row) => <span className='text-gray-700'>{row.namaKelas || '-'}</span>,
        },
        {
            key: 'aksi',
            label: 'Aksi',
            render: (row) => (
                <div className='flex gap-2'>
                    <Link href={`/page/data-kelas/${tahunAjaranId}/${row.id}`}>
                        <button className='text-xs bg-blue-100 text-blue-500 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors'>
                            Lihat
                        </button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className='min-h-screen bg-gray-100'>
                <div className='mx-auto max-w-7xl bg-white p-6 shadow-md rounded-xl'>
                    {data?.data?.map((siswa) => (
                        <div key={siswa.id}>
                            <h1 className='text-2xl font-bold text-gray-800'>
                                {tahunAjaranData?.data?.namaTahunAjaran || 'Loading...'}
                            </h1>
                        </div>
                    ))}

                    <div className='flex items-center justify-between mt-5 mb-3'>
                        {/* LEFT: SEARCH */}
                        <div className='relative w-full md:w-80'>
                            <input
                                type='text'
                                placeholder='Cari nama, kelas, atau data siswa...'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className='w-full pl-10 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                            />
                        </div>
                    </div>

                    {isLoading && <p className='text-center text-gray-400 py-8'>Memuat Data...</p>}
                    {isError && <p className='text-center text-red-400 py-8'>Gagal Memuat Data</p>}
                    {!isLoading && !isError && <Table columns={columns} data={kelasData} />}
                </div>
            </div>
        </>
    );
}
