'use client';

import { useState } from 'react';
import { useCreateJadwalMutation } from '../../../../../hooks/api/jadwalSliceAPI';
import KelasSearchDropdown from '../../../ui/kelasSearchDropdown';
import PelajaranSearchDropdown from '../../../ui/pelajaranSearchDropdown';

export default function FormTambahJadwal({ onSuccess, onCancel }) {
    const [hari, setHari] = useState('');
    const [jamMulai, setJamMulai] = useState('');
    const [jamSelesai, setJamSelesai] = useState('');
    const [kelasId, setKelasId] = useState('');
    const [pelajaranId, setPelajaranId] = useState('');

    const [createJadwal, { isLoading, isError, error }] = useCreateJadwalMutation();

    const handleCreate = async (e) => {
        e.preventDefault();

        try {
            const result = await createJadwal({
                hari,
                jamMulai,
                jamSelesai,
                pelajaranId,
                kelasId,
            }).unwrap();

            const hariSuccess = hari;
            const jamMulaiSuccess = jamMulai;
            const jamSelesaiSuccess = jamSelesai;
            const pelajaranIdSuccess = pelajaranId;
            const kelasIdSuccess = kelasId;

            setHari('');
            setJamMulai('');
            setJamSelesai('');
            setPelajaranId('');
            setKelasId('');

            if (onSuccess) {
                onSuccess(result, {
                    hari: hariSuccess,
                    jamMulai: jamMulaiSuccess,
                    jamSelesai: jamSelesaiSuccess,
                    pelajaranId: pelajaranIdSuccess,
                    kelasId: kelasIdSuccess,
                });
            }
        } catch (err) {
            console.error('ERROR', err);
        }
    };
    return (
        <form onSubmit={handleCreate} className="space-y-4">
            <div>
                <label className="text-sm text-gray-600">Hari</label>
                <select
                    value={hari}
                    onChange={(e) => setHari(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
                >
                    <option value="">Pilih Hari</option>
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                    <option value="Minggu">Minggu</option>
                </select>
            </div>

            <div>
                <label className="text-sm text-gray-600">Jam Mulai</label>
                <input
                    type="time"
                    value={jamMulai}
                    onChange={(e) => setJamMulai(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
                />
            </div>

            <div>
                <label className="text-sm text-gray-600">Jam Selesai</label>
                <input
                    type="time"
                    value={jamSelesai}
                    onChange={(e) => setJamSelesai(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
                />
            </div>

            <div>
                <label className="text-sm text-gray-600">Kelas</label>
                <KelasSearchDropdown value={kelasId} onChange={(val) => setKelasId(val)} />
            </div>

            <div>
                <label className="text-sm text-gray-600">Pelajaran</label>
                <PelajaranSearchDropdown value={pelajaranId} onChange={(val) => setPelajaranId(val)} />
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
