import { useModifySiswaMutation } from '@/src/hooks/api/siswaSliceAPI';
import { useState } from 'react';

export default function FormEditNilaiSiswa({ initialData, onSuccess, onCancel }) {
    const [nilai, setNilai] = useState(
        initialData?.nilai?.map((n) => ({
            pelajaranId: n.pelajaranId,
            nilai: n.nilai,
        })) || [],
    );

    const [nilaiKriteria, setNilaiKriteria] = useState(
        initialData?.nilaiKriteria?.map((n) => ({
            kriteriaId: n.kriteriaId,
            nilai: n.nilai,
        })),
    );

    const [updateNilai, { isLoading, isError, error }] = useModifySiswaMutation();

    const handleNilai = (pelajaranId, value) => {
        setNilai((prev) => prev.map((n) => (n.pelajaranId === pelajaranId ? { ...n, nilai: Number(value) } : n)));
    };

    const handleNilaiKriteria = (kriteriaId, value) => {
        setNilaiKriteria((prev) => prev.map((n) => (n.kriteriaId === kriteriaId ? { ...n, nilai: Number(value) } : n)));
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                id: initialData.id,
                nilai,
                nilaiKriteria,
            };

            await updateNilai(payload).unwrap();
            if (onSuccess) onSuccess(payload);
        } catch (err) {
            console.error('Status:', err?.status);
        }
    };

    return (
        <form onSubmit={handleEdit} className="space-y-4">
            {/* Nilai per Pelajaran */}
            <div>
                <label className="text-sm text-gray-600">Nilai</label>
                <div className="mt-1 space-y-2 max-h-48 overflow-y-auto pr-1">
                    {initialData?.nilai?.map((n) => (
                        <div key={n.pelajaranId} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 flex-1">{n.pelajaran.namaPelajaran}</span>
                            <input
                                type="number"
                                min={0}
                                max={100}
                                value={nilai.find((v) => v.pelajaranId === n.pelajaranId)?.nilai ?? 0}
                                onChange={(e) => handleNilai(n.pelajaranId, e.target.value)}
                                className="w-20 px-3 py-1.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700 text-sm"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {initialData?.nilaiKriteria?.length > 0 && (
                <div>
                    <label className="text-sm text-gray-600">Nilai Kriteria</label>
                    <div className="mt-1 space-y-2 max-h-48 overflow-y-auto pr-1">
                        {initialData?.nilaiKriteria?.map((n) => (
                            <div key={n.kriteriaId} className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 flex-1">
                                    {n.kriteria.namaKriteria}
                                    <span
                                        className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${n.kriteria.jenis === 'Benefit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                                    >
                                        {n.kriteria.jenis}
                                    </span>
                                </span>
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={nilaiKriteria.find((v) => v.kriteriaId === n.kriteriaId)?.nilai ?? 0}
                                    onChange={(e) => handleNilaiKriteria(n.kriteriaId, e.target.value)}
                                    className="w-20 px-3 py-1.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700 text-sm"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
