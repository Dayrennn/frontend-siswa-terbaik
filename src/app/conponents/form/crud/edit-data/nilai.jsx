import { useState } from 'react';
import { useSimpanNilaiRekapMutation } from '@/src/hooks/api/nilaiRekapSliceAPI';

export default function FormEditNilai({ initialData, onSuccess, onCancel }) {
    const [nilaiTugas, setNilaiTugas] = useState(initialData?.nilaiTugas || '');
    const [nilaiUH, setNilaiUH] = useState(initialData?.nilaiUH || '');
    const [nilaiUTS, setNilaiUTS] = useState(initialData?.nilaiUTS || '');
    const [nilaiUAS, setNilaiUAS] = useState(initialData?.nilaiUAS || '');

    const [updateNilai, { isLoading, isError, error }] = useSimpanNilaiRekapMutation();

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const result = await updateNilai({
                siswaId: initialData.siswaId,
                pelajaranId: initialData.pelajaranId,
                data: {
                    nilaiTugas: Number(nilaiTugas),
                    nilaiUH: Number(nilaiUH),
                    nilaiUTS: Number(nilaiUTS),
                    nilaiUAS: Number(nilaiUAS),
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
                <label className="text-sm text-gray-600">Nilai Tugas</label>
                <input
                    type="number"
                    placeholder="Masukkan Nilai Tugas"
                    value={nilaiTugas}
                    onChange={(e) => setNilaiTugas(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none  text-gray-700"
                />
            </div>
            <div>
                <label className="text-sm text-gray-600">Nilai UH</label>
                <input
                    type="number"
                    placeholder="Masukkan Nilai UH"
                    value={nilaiUH}
                    onChange={(e) => setNilaiUH(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none  text-gray-700"
                />
            </div>
            <div>
                <label className="text-sm text-gray-600">Nilai UTS</label>
                <input
                    type="number"
                    placeholder="Masukkan nilai UTS"
                    value={nilaiUTS}
                    onChange={(e) => setNilaiUTS(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none  text-gray-700"
                />
            </div>
            <div>
                <label className="text-sm text-gray-600">Nilai UAS</label>
                <input
                    type="number"
                    placeholder="Masukkan nilai UAS"
                    value={nilaiUAS}
                    onChange={(e) => setNilaiUAS(e.target.value)}
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
