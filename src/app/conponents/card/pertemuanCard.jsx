import { LayoutList, Trash2, Eye } from 'lucide-react';

export default function PertemuanCard({ namaPertemuan, onDelete, customHref }) {
    return (
        <div className='flex items-center justify-between px-4 py-3 bg-white border border-neutral-200 rounded-xl w-full'>
            {/* Left */}
            <div className='flex items-center gap-3'>
                <LayoutList className='w-5 h-5 text-neutral-700' />
                <span className='text-neutral-800 text-sm font-normal'>{namaPertemuan}</span>
            </div>
            <div className='flex justify-end gap-2'>
                <button
                onClick={customHref}
                className='text-blue-400 hover:text-blue-600 transition-colors'
            >
                <Eye className='w-4 h-4' />
            </button>
            <button
                onClick={onDelete}
                className='text-red-400 hover:text-red-600 transition-colors'
            >
                <Trash2 className='w-4 h-4' />
            </button>
            </div>
        </div>
    );
}
