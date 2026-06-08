'use client';

import { useSeeAllTahunAjaranQuery } from '../../../../hooks/api/tahunAjaranSliceAPI';
import Link from 'next/link';
import Table from '../../../conponents/table/page';

export default function DataKelas() {
    const { data, isLoading, isError } = useSeeAllTahunAjaranQuery();

    const tahunAjaranData =
        data?.data?.map((item, index) => ({ no: index + 1, ...item })) ?? [];

    const totalAktif = data?.data?.filter((item) => item.status === 'Aktif').length ?? 0;
    const totalTahun = data?.data?.length ?? 0;

    const columns = [
        { key: 'no', label: 'No' },
        {
            key: 'namaTahunAjaran',
            label: 'Tahun Ajaran',
            render: (row) => (
                <span className='font-medium text-gray-800'>{row.namaTahunAjaran || '-'}</span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.status === 'Aktif'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                    }`}
                >
                    {row.status === 'Aktif' ? '● Aktif' : '○ Tidak Aktif'}
                </span>
            ),
        },
        {
            key: 'aksi',
            label: 'Aksi',
            render: (row) => (
                <Link href={`data-kelas/${row.id}`}>
                    <span className='inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium cursor-pointer'>
                        Lihat Data →
                    </span>
                </Link>
            ),
        },
    ];

    return (
        <div className='min-h-screen bg-gray-50 p-6'>
            <div className='mx-auto max-w-7xl'>

                {/* Header */}
                <div className='mb-5'>
                    <h1 className='text-xl font-medium text-gray-900'>Data Kelas</h1>
                    <p className='text-sm text-gray-400 mt-0.5'>Pilih tahun ajaran untuk melihat data kelas</p>
                </div>

                {/* Stat Cards */}
                <div className='grid grid-cols-2 gap-3 mb-5'>
                    <div className='bg-white rounded-xl border border-gray-100 px-4 py-3'>
                        <p className='text-xs text-gray-400 mb-1'>Total Tahun Ajaran</p>
                        <p className='text-2xl font-medium text-gray-800'>{totalTahun}</p>
                    </div>
                    <div className='bg-white rounded-xl border border-gray-100 px-4 py-3'>
                        <p className='text-xs text-gray-400 mb-1'>Tahun Ajaran Aktif</p>
                        <p className='text-2xl font-medium text-green-600'>{totalAktif}</p>
                    </div>
                </div>

                {/* Main Card */}
                <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'>

                    {/* Table */}
                    {isLoading && (
                        <p className='text-center text-gray-400 py-12 text-sm'>Memuat data...</p>
                    )}
                    {isError && (
                        <p className='text-center text-red-400 py-12 text-sm'>Gagal memuat data</p>
                    )}
                    {!isLoading && !isError && <Table columns={columns} data={tahunAjaranData} />}

                    {/* Footer */}
                    {!isLoading && !isError && (
                        <div className='mt-4 pt-4 border-t border-gray-100'>
                            <p className='text-xs text-gray-400'>
                                {totalTahun} tahun ajaran terdaftar · {totalAktif} aktif
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}