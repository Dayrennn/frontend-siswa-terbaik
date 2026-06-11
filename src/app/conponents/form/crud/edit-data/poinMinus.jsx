'use client';

import { useEditPoinMinusMutation } from '@/src/hooks/api/poinMinusSliceAPI';
import { useDispatch } from 'react-redux';
import { siswaAPI } from '@/src/hooks/api/siswaSliceAPI';

export default function FormEditPoinMinus({ onCancel, initialData, onSuccess }) {
    const [editPoinMinus, { isLoading }] = useEditPoinMinusMutation();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        try {
            await editPoinMinus({
                id: initialData.id,
                deskripsi: form.deskripsi.value,
                poin: Number(form.poin.value),
                tanggal: form.tanggal.value,
            }).unwrap();
            dispatch(siswaAPI.util.invalidateTags(['siswaAPI']));
            onSuccess();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Deskripsi</label>
                <input
                    name="deskripsi"
                    defaultValue={initialData?.deskripsi}
                    placeholder="Masukkan deskripsi"
                    className="w-full px-3 py-2 text-sm border text-gray-800 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                    required
                />
            </div>

            <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Poin</label>
                <input
                    name="poin"
                    type="number"
                    defaultValue={initialData?.poin}
                    placeholder="Masukkan poin"
                    min={1}
                    className="w-full px-3 py-2 text-sm border text-gray-800 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                    required
                />
            </div>

            <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Tanggal</label>
                <input
                    name="tanggal"
                    type="date"
                    defaultValue={initialData?.tanggal?.split('T')[0]}
                    className="w-full px-3 py-2 text-sm border text-gray-800 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />
            </div>

            <div className="flex gap-2 pt-1">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                    {isLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>
        </form>
    );
}
