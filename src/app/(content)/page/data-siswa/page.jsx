'use client';
import Table from '../../../conponents/table/page';
import { useSeeAllTahunAjaranQuery } from '../../../../hooks/api/tahunAjaranSliceAPI';
import Link from 'next/link';

export default function DataSiswa() {
    const { data, isLoading, isError } = useSeeAllTahunAjaranQuery();

    const tahunAjaranData =
        data?.data?.map((item, index) => {
            return {
                no: index + 1,
                ...item,
            };
        }) ?? [];

    const columns = [
        { key: 'no', label: 'No' },
        {
            key: 'namaTahunAjaran',
            label: 'Tahun Ajaran',
            render: (row) => <span className='text-gray-700'>{row.namaTahunAjaran || '-'}</span>,
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                        row.status === 'Aktif'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-red-100 text-red-600'
                    }`}
                >
                    {row.status || '-'}
                </span>
            ),
        },
        {
            key: 'lihat',
            label: 'Lihat',
            render: (row) => (
                <Link href={`/page/data-siswa/${row.id}`}>
                    <button className='text-xs bg-blue-100 text-blue-500 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors'>
                        Lihat
                    </button>
                </Link>
            ),
        },
    ];

    return (
        <>
            <div className='min-h-screen bg-gray-100'>
                <div className='mx-auto max-w-7xl bg-white p-6 shadow-md rounded-xl'>
                    <h1 className='text-2xl font-bold text-gray-800'>Data Siswa</h1>
                    <div className='flex justify-between items-center mt-4 mb-4'>
                        <p className='text-gray-600 text-sm'>
                            Pilih Tahun Ajaran atau lihat semua data siswa
                        </p>

                        <Link
                            href='/page/data-siswa/all-siswa'
                            className='text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors'
                        >
                            Tampilkan Semua
                        </Link>
                    </div>

                    <div className='mt-5 mb-3'>
                        {isLoading && (
                            <p className='text-center text-gray-400 py-8'>Memuat Data...</p>
                        )}

                        {isError && (
                            <p className='text-center text-red-400 py-8'>Gagal Memuat Data</p>
                        )}

                        {!isLoading && !isError && (
                            <Table columns={columns} data={tahunAjaranData} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
