'use client';

import { useGetOneSiswaHafalanQuery, siswaAPI } from '@/src/hooks/api/siswaSliceAPI';
import Table from '@/src/app/conponents/table/page';
import EditModal from '@/src/app/conponents/modal/crud/editModal';
import FormEditHafalan from '@/src/app/conponents/form/crud/edit-data/hafalan';
import { useSelector, useDispatch } from 'react-redux';
import { PencilIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { selectUser } from '@/src/hooks/api/authSliceAPI';

export default function SiswaHafalan() {
    const { siswaId } = useParams();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const isAdmin = user?.role === 'Admin';
    const isWakilKepalaSekolah = user?.role === 'WakilKepalaSekolah';
    const isKepalaSekolah = user?.role === 'KepalaSekolah';
    const canEdit = isAdmin || isWakilKepalaSekolah || isKepalaSekolah;

    const { data, isLoading, isError, error } = useGetOneSiswaHafalanQuery(siswaId);
    const hafalanSiswa = data?.data ?? [];

    const tableData = hafalanSiswa.map((siswa, index) => ({ no: index + 1, ...siswa }));

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSiswa, setSelectedSiswa] = useState(null);

    const handleEdit = (siswa) => {
        setSelectedSiswa(siswa);
        setShowEditModal(true);
    };

    const handleAfterSuccess = () => {
        dispatch(siswaAPI.util.invalidateTags(['siswaAPI']));
    };

    const columns = [
        { key: 'no', label: 'No' },
        {
            key: 'namaSiswa',
            label: 'Nama Siswa',
            render: (row) => <span className="font-medium text-gray-800">{row.namaSiswa || '-'}</span>,
        },
        {
            key: 'kelas',
            label: 'Kelas',
            render: (row) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {row.kelas ? `${row.kelas.kodeKelas} · ${row.kelas.namaKelas}` : '-'}
                </span>
            ),
        },
        {
            key: 'tahunAjaran',
            label: 'Tahun Ajaran',
            render: (row) => <span className="text-sm text-gray-500">{row.tahunAjaran?.namaTahunAjaran || '-'}</span>,
        },
        {
            key: 'hafalan',
            label: 'Hafalan',
            render: (row) =>
                row.hafalan ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                        {row.hafalan.jumlahJuz} Juz
                    </span>
                ) : (
                    <span className="text-xs text-gray-400">Belum ada catatan</span>
                ),
        },
        {
            key: 'keterangan',
            label: 'Keterangan',
            render: (row) => <span className="text-sm text-gray-500">{row.hafalan?.keterangan || '-'}</span>,
        },
        {
            key: 'aksi',
            label: 'Aksi',
            render: (row) => (
                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    {canEdit && (
                        <>
                            <button
                                type="button"
                                onClick={() => handleEdit(row)}
                                className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium cursor-pointer"
                            >
                                <PencilIcon className="h-3.5 w-3.5" />
                                Edit
                            </button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-4 sm:mb-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Rekap Tahfidz</p>
                    <h1 className="text-lg sm:text-xl font-medium text-gray-900">Data Hafalan Siswa</h1>
                    <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Rekap hafalan tahfidz {hafalanSiswa[0]?.namaSiswa}</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-5">
                    {isLoading && <p className="text-center text-gray-400 py-12 text-sm">Memuat data...</p>}

                    {isError && (
                        <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-400">
                            {error?.data?.message ?? 'Gagal mengambil data. Coba muat ulang halaman.'}
                        </div>
                    )}

                    {!isLoading && !isError && <Table columns={columns} data={tableData} />}
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
