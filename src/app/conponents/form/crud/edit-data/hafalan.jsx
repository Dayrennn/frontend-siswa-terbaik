import { useState } from 'react';
import { useSimpanHafalanMutation } from '@/src/hooks/api/hafalanSliceAPI';

export default function FormEditHafalan({ initialData, onSuccess, onCancel }) {
    const [jumlahJuz, setJumlahJuz] = useState(initialData?.jumlahJuz || '');

    const [updateHafalan, { isLoading, isError, error }] = useSimpanHafalanMutation();

    const handleEdit = async (e) => {
        e.preventDefault();

        try {
            const result = await updateHafalan({ siswaId: initialData.id, data: { jumlahJuz: Number(jumlahJuz) } }).unwrap();
            if (onSuccess) onSuccess(result);
        } catch (err) {
            console.error('ERROR', err);
        }
    };

    return (
        <form onSubmit={handleEdit} className="space-y-4">
            <div>
                <label className="text-sm text-gray-600">Jumlah Juz</label>
                <input
                    type="Number"
                    placeholder="Masukkan Nama Tahun Ajaran"
                    value={jumlahJuz}
                    onChange={(e) => setJumlahJuz(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none  text-gray-700"
                />
            </div>

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
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-white text-sm font-medium bg-blue-500 hover:bg-blue-600 transition-colors"
                >
                    {isLoading ? 'Menyimpan...' : 'Simpan Data'}
                </button>
            </div>

            {isError && (
                <p className="text-red-500 text-sm text-center">{error?.data?.message || 'Terjadi kesalahan'}</p>
            )}
        </form>
    );
}
