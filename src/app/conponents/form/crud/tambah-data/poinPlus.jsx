'use client';

import { useState } from 'react';
import { useCreatePoinPlusMutation } from '@/src/hooks/api/poinPlusSliceAPI';
import { useCreatePoinMinusMutation } from '@/src/hooks/api/poinMinusSliceAPI';
import { siswaAPI } from '@/src/hooks/api/siswaSliceAPI';
import { useDispatch } from 'react-redux';

export default function FormTambahPoinSiswa({ onSuccess, onCancel, siswaId }) {
    const dispatch = useDispatch();
    const [jenis, setJenis] = useState('plus');
    const [deskripsi, setDeskripsi] = useState('');
    const [poin, setPoin] = useState('');
    const [tanggal, setTanggal] = useState('');

    const [createPoinPlus, { isLoading: loadingPlus }] = useCreatePoinPlusMutation();
    const [createPoinMinus, { isLoading: loadingMinus }] = useCreatePoinMinusMutation();

    const isLoading = loadingPlus || loadingMinus;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (jenis === 'plus') {
                await createPoinPlus({ siswaId, deskripsi, poin: Number(poin), tanggal }).unwrap();
            } else {
                await createPoinMinus({ siswaId, deskripsi, poin: Number(poin), tanggal }).unwrap();
            }

            dispatch(siswaAPI.util.invalidateTags(['siswaAPI']));
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('ERROR', err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Jenis Poin */}
            <div>
                <label className="text-sm text-gray-600">Jenis Poin</label>
                <div className="flex gap-2 mt-1">
                    <button
                        type="button"
                        onClick={() => setJenis('plus')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                            jenis === 'plus'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`}
                    >
                        + Poin Plus
                    </button>
                    <button
                        type="button"
                        onClick={() => setJenis('minus')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                            jenis === 'minus'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`}
                    >
                        - Poin Minus
                    </button>
                </div>
            </div>

            {/* Deskripsi */}
            <div>
                <label className="text-sm text-gray-600">Deskripsi</label>
                <input
                    type="text"
                    placeholder="Masukkan deskripsi"
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700 text-sm"
                />
            </div>

            {/* Poin */}
            <div>
                <label className="text-sm text-gray-600">Poin</label>
                <input
                    type="number"
                    placeholder="Masukkan jumlah poin"
                    value={poin}
                    onChange={(e) => setPoin(e.target.value)}
                    min={1}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700 text-sm"
                />
            </div>

            {/* Tanggal */}
            <div>
                <label className="text-sm text-gray-600">Tanggal</label>
                <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700 text-sm"
                />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-60"
                >
                    {isLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>
        </form>
    );
}
