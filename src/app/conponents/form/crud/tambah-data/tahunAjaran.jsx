'use client';

import { useState } from 'react';
import { useCreateTahunAjaranMutation } from '../../../../../hooks/api/tahunAjaranSliceAPI';

export default function FormTambahTahunAjaran({ onCancel, onSuccess }) {
    const [namaTahunAjaran, setNamaTahunAjaran] = useState('');
    const [status, setStatus] = useState('Aktif');

    const [createTahunAjaran, { isLoading, isError, error }] = useCreateTahunAjaranMutation();

    const handleCreate = async (e) => {
        e.preventDefault();

        try {
            const result = await createTahunAjaran({
                namaTahunAjaran,
                status,
            }).unwrap();

            const namaTahunAjaranSuccess = namaTahunAjaran;

            setNamaTahunAjaran('');

            if (onSuccess) {
                onSuccess(result, {
                    namaTahunAjaran: namaTahunAjaranSuccess,
                });
            }
        } catch (err) {
            console.error('ERROR', err);
        }
    };

    return (
        <form onSubmit={handleCreate} className='space-y-4'>
            <div>
                <label className='text-sm text-gray-600'>Nama Tahun Ajaran</label>
                <input
                    type='text'
                    placeholder='Masukkan Nama Tahun Ajaran'
                    value={namaTahunAjaran}
                    onChange={(e) => setNamaTahunAjaran(e.target.value)}
                    className='w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none  text-gray-700'
                />
            </div>

            <div>
                <label className='text-sm text-gray-600'>Status</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className='w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700'
                >
                    <option value='Aktif'>Aktif</option>
                    <option value='Nonaktif'>Nonaktif</option>
                </select>
            </div>

            <div className='flex gap-3'>
                <button
                    onClick={onCancel}
                    type='button'
                    disabled={isLoading}
                    className='flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-60'
                >
                    Batal
                </button>

                <button
                    type='submit'
                    disabled={isLoading}
                    className='flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-white text-sm font-medium bg-blue-500 hover:bg-blue-600 transition-colors'
                >
                    {isLoading ? 'Menyimpan...' : 'Simpan Data'}
                </button>
            </div>

            {isError && (
                <p className='text-red-500 text-sm text-center'>
                    {error?.data?.message || 'Terjadi kesalahan'}
                </p>
            )}
        </form>
    );
}
