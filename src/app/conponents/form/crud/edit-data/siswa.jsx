import { useState } from 'react';
import { useModifySiswaMutation } from '../../../../../hooks/api/siswaSliceAPI';
import KelasSearchDropdown from '../../../ui/kelasSearchDropdown';
import EskulSearchDropdown from '../../../ui/eskulSearchDropdown';
import TahunAjaranSearchDropdown from '../../../ui/tahunAjaranSearchDropdown';

export default function FormEditDataSiswa({ initialData, onSuccess, onCancel }) {
    const [namaSiswa, setNamaSiswa] = useState(initialData?.namaSiswa || '');
    const [tanggalLahir, setTanggalLahir] = useState(initialData?.tanggalLahir?.split('T')[0] || '');
    const [tahunAjaranId, setTahunAjaranId] = useState(initialData?.tahunAjaranId || '');

    const [kelasId, setKelasId] = useState(initialData?.kelasId || '');
    const [eskulId, setEskulId] = useState(initialData?.eskulId || '');

    const [updateSiswa, { isLoading, isError, error }] = useModifySiswaMutation();
    const handleEdit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                id: initialData.id,
                namaSiswa,
                tanggalLahir: tanggalLahir ? new Date(tanggalLahir).toISOString() : undefined,
                eskulId,
                tahunAjaranId
            };

            await updateSiswa(payload).unwrap();
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Status:', err?.status);
        }
    };
    return (
        <form onSubmit={handleEdit} className="space-y-4">
            {/* Nama Siswa */}
            <div>
                <label className="text-sm text-gray-600">Nama Siswa</label>
                <input
                    type="text"
                    placeholder="Masukkan Nama Siswa"
                    value={namaSiswa}
                    onChange={(e) => setNamaSiswa(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
                />
            </div>

            {/* Tanggal Lahir */}
            <div>
                <label className="text-sm text-gray-600">Tanggal Lahir</label>
                <input
                    type="date"
                    value={tanggalLahir}
                    onChange={(e) => setTanggalLahir(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
                />
            </div>

            {/* Kelas */}
            <div>
                <label className="text-sm text-gray-600">Kelas</label>
                <KelasSearchDropdown
                    value={kelasId}
                    initialLabel={
                        initialData?.kelas ? `${initialData.kelas.kodeKelas} - ${initialData.kelas.namaKelas}` : ''
                    }
                    onChange={(val) => setKelasId(val)}
                />
            </div>

            <div>
                <label className="text-sm text-gray-600">TahunAjaran</label>
                <TahunAjaranSearchDropdown  
                    value={tahunAjaranId}
                    initialLabel={
                        initialData?.tahunAjaran ? `${initialData.tahunAjaran.namaTahunAjaran} - ${initialData.tahunAjaran.status}` : ''
                    }
                    onChange={(val) => setTahunAjaranId(val)}
                />
            </div>
            <div>
                <label className="text-sm text-gray-600">Eskul</label>
                <EskulSearchDropdown
                    key={initialData?.eskulId}
                    value={eskulId}
                    initialLabel={initialData?.nilaiEskulRekap?.[0]?.eskul?.namaEskul || ''}
                    onChange={(val) => setEskulId(val)}
                />
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
