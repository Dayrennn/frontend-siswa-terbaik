import { useState } from 'react';
import { useModifyPelajaranMutation } from '@/src/hooks/api/pelajaranSliceAPI';
import PelajaranSearchDropdown from '../../../ui/pelajaranSearchDropdown';
import GuruSearchDropdown from '../../../ui/guruSearchDropdown';

export default function FormEditDataPelajaran({ initialData, onSuccess, onCancel }) {
    const [namaPelajaran, setNamaPelajaran] = useState(initialData?.namaPelajaran || '');
    const [kodePelajaran, setKodePelajaran] = useState(initialData?.kodePelajaran || '');
    const [guruId, setGuruId] = useState(initialData?.pelajaranId || '');
    const [updatePelajaran, { isLoading, isError, error }] = useModifyPelajaranMutation();

    const handleEdit = async (e) => {
        e.preventDefault();

        try {
            const result = await updatePelajaran({
                id: initialData.id,
                namaPelajaran,
                kodePelajaran,
                guruId,
            }).unwrap();

            // trigger modal sukses
            if (onSuccess) onSuccess(result);
        } catch (err) {
            console.error('ERROR', err);
        }
    };

    return (
        <form onSubmit={handleEdit} className="space-y-4">
            <div>
                <label className="text-sm text-gray-600">Nama Pelajaran</label>
                <input
                    type="text"
                    placeholder="Masukkan Nama Tahun Ajaran"
                    value={namaPelajaran}
                    onChange={(e) => setNamaPelajaran(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none  text-gray-700"
                />
            </div>
            <div>
                <label className="text-sm text-gray-600">Kode Pelajaran</label>
                <input
                    type="text"
                    value={kodePelajaran}
                    onChange={(e) => setKodePelajaran(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
                />
            </div>
            <div>
                <label className="text-sm text-gray-600">Guru</label>
                <GuruSearchDropdown value={guruId} onChange={(val) => setGuruId(val)} />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={onCancel}
                    type="button"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-medium bg-blue-500 hover:bg-blue-600 transition-colors"
                >
                    {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>

            {/* Error */}
            {isError && (
                <p className="text-red-500 text-sm text-center">{error?.data?.message || 'Terjadi kesalahan'}</p>
            )}
        </form>
    );
}
