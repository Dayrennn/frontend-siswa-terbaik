import { useState } from 'react';
import { useModifyKelasMutation } from '../../../../../hooks/api/kelasSliceAPI';
import KelasIndukSearchDropdown from '../../../ui/kelasIndukSearchDropdown';

export default function FormEditDataKelas({ initialData, onSuccess, onCancel }) {
    const [kodeKelas, setKodeKelas] = useState(initialData?.kodeKelas || '');
    const [namaKelas, setNamaKelas] = useState(initialData?.namaKelas || '');
    const [kelasIndukId, setKelasIndukId] = useState(initialData?.kelasInduk?.id || null);

    const [updateKelas, { isLoading, isError, error }] = useModifyKelasMutation();

    const handleEdit = async (e) => {
        e.preventDefault();

        try {
            const result = await updateKelas({
                id: initialData.id,
                kodeKelas,
                namaKelas,
                kelasIndukId,
            }).unwrap();

            if (onSuccess) onSuccess(result);
        } catch (err) {
            console.error('ERROR', err);
        }
    };

    return (
        <form onSubmit={handleEdit} className="space-y-4">
            <div>
                <label className="text-sm text-gray-600">Kode Kelas</label>
                <input
                    type="text"
                    placeholder="Masukkan Kode Kelas"
                    value={kodeKelas}
                    onChange={(e) => setKodeKelas(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none  text-gray-700"
                />
            </div>

            <div>
                <label className="text-sm text-gray-600">Kelas Induk</label>
                <KelasIndukSearchDropdown
                    initialLabel={initialData?.kelasInduk?.namaKelasInduk}
                    value={kelasIndukId}
                    onChange={(val) => setKelasIndukId(val)}
                />
            </div>

            <div>
                <label className="text-sm text-gray-600">Nama Kelas</label>
                <input
                    type="text"
                    placeholder="Masukkan Nama Kelas"
                    value={namaKelas}
                    onChange={(e) => setNamaKelas(e.target.value)}
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
