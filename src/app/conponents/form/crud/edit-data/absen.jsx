import { useState } from 'react';
import { useSimpanAbsenMutation } from '@/src/hooks/api/absenRekapSliceAPI';

export default function FormEditAbsen({ initialData, onSuccess, onCancel }) {
    const [totalPertemuan, setTotalPertemuan] = useState(initialData?.totalPertemuan || '');
    const [totalHadir, setTotalHadir] = useState(initialData?.totalHadir || '');
    const [totalSakit, setTotalSakit] = useState(initialData?.totalSakit || '');
    const [totalAlpha, setTotalAlpha] = useState(initialData?.totalAlpha || '');
    const [totalIzin, setTotalIzin] = useState(initialData?.totalIzin || '');

    const [updateAbsen, { isLoading, isError, error }] = useSimpanAbsenMutation();

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const result = await updateAbsen({
                siswaId: initialData.siswaId,
                pelajaranId: initialData.pelajaranId,
                data: {
                    totalPertemuan: Number(totalPertemuan),
                    totalHadir: Number(totalHadir),
                    totalSakit: Number(totalSakit),
                    totalAlpha: Number(totalAlpha),
                    totalIzin: Number(totalIzin),
                },
            }).unwrap();
            if (onSuccess) onSuccess(result);
        } catch (err) {
            console.error('ERROR', err);
        }
    };
    return (
        <form onSubmit={handleEdit} className="space-y-4">
            <div>
                <label className="text-sm text-gray-600">Total Pertemuan</label>
                <input
                    type="number"
                    placeholder="Masukkan Total Pertemuan"
                    value={totalPertemuan}
                    onChange={(e) => setTotalPertemuan(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none  text-gray-700"
                />
            </div>
            <div>
                <label className="text-sm text-gray-600">Total Hadir</label>
                <input
                    type="number"
                    placeholder="Masukkan Total Hadir"
                    value={totalHadir}
                    onChange={(e) => setTotalHadir(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none  text-gray-700"
                />
            </div>
            <div>
                <label className="text-sm text-gray-600">Total Sakit</label>
                <input
                    type="number"
                    placeholder="Masukkan Total Sakit"
                    value={totalSakit}
                    onChange={(e) => setTotalSakit(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none  text-gray-700"
                />
            </div>
            <div>
                <label className="text-sm text-gray-600">Total Alpha</label>
                <input
                    type="number"
                    placeholder="Masukkan Total Alpha"
                    value={totalAlpha}
                    onChange={(e) => setTotalAlpha(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none  text-gray-700"
                />
            </div>
            <div>
                <label className="text-sm text-gray-600">Total Hadir</label>
                <input
                    type="number"
                    placeholder="Masukkan Total Hadir"
                    value={totalIzin}
                    onChange={(e) => setTotalIzin(e.target.value)}
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
