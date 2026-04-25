'use client';

import { useState, useRef, useEffect } from 'react';
import { useGetAllKelasQuery } from '../../../hooks/api/kelasSliceAPI';

export default function KelasSearchDropdown({ value, onChange }) {
    const [search, setSearch] = useState(value || '');
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef();

    const { data, isLoading } = useGetAllKelasQuery();
    const kelasList = data?.data ?? [];

    const filtered = kelasList.filter(
        (k) =>
            k.kodeKelas.toLowerCase().includes(search.toLowerCase()) ||
            k.namaKelas.toLowerCase().includes(search.toLowerCase()),
    );

    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSelect = (kelas) => {
        setSearch(`${kelas.kodeKelas} - ${kelas.namaKelas}`);
        onChange(kelas.id);
        setOpen(false);
    };

    return (
        <div ref={wrapperRef} className='relative'>
            <input
                type='text'
                placeholder='Cari kelas...'
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                className='w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700'
            />

            {open && (
                <div className='absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto'>
                    {isLoading ? (
                        <p className='text-sm text-gray-400 px-3 py-2'>Memuat...</p>
                    ) : filtered.length === 0 ? (
                        <p className='text-sm text-gray-400 px-3 py-2'>Tidak ditemukan</p>
                    ) : (
                        filtered.map((k) => (
                            <button
                                key={k.id}
                                type='button'
                                onClick={() => handleSelect(k)}
                                className='w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors'
                            >
                                <span className='font-medium'>{k.kodeKelas}</span>
                                <span className='text-gray-400'> — {k.namaKelas}</span>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
