'use client';

import { useParams } from 'next/navigation';
import {
    useGetAbsenByPertemuanQuery,
    useModifyKehadiranMutation
} from '../../../../../../../../hooks/api/kehadiranSliceAPI';
import Table from '../../../../../../../conponents/table/page';

const STATUS_OPTIONS = ['Hadir', 'Izin', 'Sakit', 'Alpha'];

const STATUS_STYLE = {
    Hadir: 'bg-green-100 text-green-700',
    Izin: 'bg-blue-100 text-blue-700',
    Sakit: 'bg-yellow-100 text-yellow-700',
    Alpha: 'bg-red-100 text-red-700',
};

export default function AbsenPage() {
    const { tahunAjaranId, kelasId, pertemuanId } = useParams();

    const {
        data: dataAbsen,
        isLoading,
        isError,
        refetch,
    } = useGetAbsenByPertemuanQuery({ tahunAjaranId, kelasId, pertemuanId });
    const [modifyKehadiran] = useModifyKehadiranMutation();

    const handleStatusChange = async (siswaId, statusKehadiran) => {
        try {
            await modifyKehadiran({
                tahunAjaranId,
                kelasId,
                pertemuanId,
                siswaId,
                statusKehadiran,
            }).unwrap();
            refetch();
        } catch (error) {
            console.error('Gagal update kehadiran:', error);
        }
    };

    const columns = [
        {
            key: 'no',
            label: 'No',
            render: (row) => <span className='text-gray-700'>{row.no}</span>,
        },
        {
            key: 'namaSiswa',
            label: 'Nama Siswa',
            render: (row) => (
                <span className='text-gray-700'>{row.siswa?.namaSiswa || '-'}</span>
            ),
        },
        {
            key: 'statusKehadiran',
            label: 'Status Kehadiran',
            render: (row) => (
                <select
                    defaultValue={row.statusKehadiran}
                    onChange={(e) => handleStatusChange(row.siswaId, e.target.value)}
                    className={`text-sm px-3 py-1.5 rounded-lg border border-neutral-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer ${STATUS_STYLE[row.statusKehadiran] ?? ''}`}
                >
                    {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            ),
        },
        {
            key: 'tanggalKehadiran',
            label: 'Tanggal',
            render: (row) => (
                <span className='text-gray-500 text-sm'>
                    {row.tanggalKehadiran?.split('T')[0] || '-'}
                </span>
            ),
        },
    ];

    const tableData =
        dataAbsen?.data?.map((item, index) => ({
            no: index + 1,
            ...item,
        })) ?? [];

    return (
        <div className='min-h-screen bg-gray-100'>
            <div className='mx-auto max-w-7xl bg-white p-6 shadow-md rounded-xl'>
                <h1 className='text-2xl font-bold text-gray-800'>Data Kehadiran</h1>
                <p className='text-sm text-gray-400 mt-1 mb-6'>
                    Ubah status kehadiran langsung dari dropdown pada tabel
                </p>

                {isLoading && (
                    <p className='text-center text-gray-400 py-8'>Memuat Data...</p>
                )}
                {isError && (
                    <p className='text-center text-red-400 py-8'>Gagal Memuat Data</p>
                )}
                {!isLoading && !isError && (
                    <Table columns={columns} data={tableData} />
                )}
            </div>
        </div>
    );
}