import { LayoutList, Trash2 } from 'lucide-react';

export default function PertemuanCard({ namaPertemuan, onDelete }) {
    return (
        <div className='flex items-center justify-between px-4 py-3 bg-white border border-neutral-200 rounded-xl w-full'>
            {/* Left */}
            <div className='flex items-center gap-3'>
                <LayoutList className='w-5 h-5 text-neutral-700' />
                <span className='text-neutral-800 text-sm font-normal'>{namaPertemuan}</span>
            </div>
            <button
                onClick={onDelete}
                className='text-red-400 hover:text-red-600 transition-colors'
            >
                <Trash2 className='w-4 h-4' />
            </button>
        </div>
    );
}
