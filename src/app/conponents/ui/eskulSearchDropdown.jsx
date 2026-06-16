'use client';

import { useState, useRef, useEffect } from 'react';
import { useSeeAllEskulQuery } from '@/src/hooks/api/eskulSliceAPI';

export default function EskulSearchDropdown({ value, onChange, initialLabel }) {
    const [search, setSearch] = useState(initialLabel || value || '');

    const [open, setOpen] = useState(false);
    const wrapperRef = useRef();

    const { data, isLoading } = useSeeAllEskulQuery();
    const eskulList = data?.data ?? [];

    const filtered = eskulList.filter((k) => k.namaEskul.toLowerCase().includes(search.toLowerCase()));

    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSelect = (eskul) => {
        setSearch(eskul.namaEskul);
        onChange(eskul.id);
        setOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <input
                type="text"
                placeholder="Cari eskul..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
            />

            {open && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {isLoading ? (
                        <p className="text-sm text-gray-400 px-3 py-2">Memuat...</p>
                    ) : filtered.length === 0 ? (
                        <p className="text-sm text-gray-400 px-3 py-2">Tidak ditemukan</p>
                    ) : (
                        filtered.map((k) => (
                            <button
                                key={k.id}
                                type="button"
                                onClick={() => handleSelect(k)}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                                <span className="font-medium">{k.namaEskul}</span>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
