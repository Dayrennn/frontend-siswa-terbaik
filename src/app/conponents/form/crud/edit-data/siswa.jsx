import { useState } from 'react';
import { useModifySiswaMutation } from '../../../../../hooks/api/siswaSliceAPI';
import KelasSearchDropdown from '../../../ui/kelasSearchDropdown';

export default function FormEditDataSiswa({ initialData, onSuccess, onCancel }) {
    const [namaSiswa, setNamaSiswa] = useState(initialData?.namaSiswa || '');
    const [tanggalLahir, setTanggalLahir] = useState(
        initialData?.tanggalLahir?.split('T')[0] || '',
    );
    const [kelas, setKelas] = useState(initialData?.kelas || '');
    const [nilai, setNilai] = useState(
        initialData?.nilai?.map((n) => ({
            pelajaranId: n.pelajaranId,
            nilai: n.nilai,
        })) || [],
    );

    const [kelasId, setKelasId] = useState(initialData?.kelasId || '');

    const [updateSiswa, { isLoading, isError, error }] = useModifySiswaMutation();

    const handleNilai = (pelajaranId, value) => {
        setNilai((prev) =>
            prev.map((n) => (n.pelajaranId === pelajaranId ? { ...n, nilai: Number(value) } : n)),
        );
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                id: initialData.id,
                namaSiswa,
                tanggalLahir: tanggalLahir ? new Date(tanggalLahir).toISOString() : undefined,
                kelasId,
                nilai,
            };

            // trigger modal sukses
            if (onSuccess) onSuccess(payload);
        } catch (err) {
            console.error('Status:', err?.status);
        }
    };
    return (
        <form onSubmit={handleEdit} className='space-y-4'>
            {/* Nama Siswa */}
            <div>
                <label className='text-sm text-gray-600'>Nama Siswa</label>
                <input
                    type='text'
                    placeholder='Masukkan Nama Siswa'
                    value={namaSiswa}
                    onChange={(e) => setNamaSiswa(e.target.value)}
                    className='w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700'
                />
            </div>

            {/* Tanggal Lahir */}
            <div>
                <label className='text-sm text-gray-600'>Tanggal Lahir</label>
                <input
                    type='date'
                    value={tanggalLahir}
                    onChange={(e) => setTanggalLahir(e.target.value)}
                    className='w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700'
                />
            </div>

            {/* Kelas */}
            <div>
                <label className='text-sm text-gray-600'>Kelas</label>
                <KelasSearchDropdown
                    value={kelasId}
                    initialLabel={
                        initialData?.kelas
                            ? `${initialData.kelas.kodeKelas} - ${initialData.kelas.namaKelas}`
                            : ''
                    }
                    onChange={(val) => setKelasId(val)}
                />
            </div>

            {/* Nilai per Pelajaran */}
            <div>
                <label className='text-sm text-gray-600'>Nilai</label>
                <div className='mt-1 space-y-2 max-h-48 overflow-y-auto pr-1'>
                    {initialData?.nilai?.map((n) => (
                        <div key={n.pelajaranId} className='flex items-center gap-3'>
                            <span className='text-sm text-gray-600 flex-1'>
                                {n.pelajaran.namaPelajaran}
                            </span>
                            <input
                                type='number'
                                min={0}
                                max={100}
                                value={
                                    nilai.find((v) => v.pelajaranId === n.pelajaranId)?.nilai ?? 0
                                }
                                onChange={(e) => handleNilai(n.pelajaranId, e.target.value)}
                                className='w-20 px-3 py-1.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700 text-sm'
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Buttons */}
            <div className='flex gap-3'>
                <button
                    onClick={onCancel}
                    type='button'
                    disabled={isLoading}
                    className='flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-60'
                >
                    Batal
                </button>
                <button
                    type='submit'
                    disabled={isLoading}
                    className='flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-medium bg-blue-500 hover:bg-blue-600 transition-colors'
                >
                    {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>

            {/* Error */}
            {isError && (
                <p className='text-red-500 text-sm text-center'>
                    {error?.data?.message || 'Terjadi kesalahan'}
                </p>
            )}
        </form>
    );
}
