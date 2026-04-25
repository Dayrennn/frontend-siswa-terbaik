export default function TahunAjaranCard({ item, onEdit, onRemove, showActions = true }) {
    return (
        <div
            key={item.id}
            className='bg-white border rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-all duration-300 w-full flex items-center justify-between'
        >
            {/* Kiri: Tahun + Status */}
            <div className='flex items-center gap-4'>
                <h2 className='text-sm font-semibold text-gray-800'>{item.namaTahunAjaran}</h2>

                <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full
            ${
                item.status === 'Aktif'
                    ? 'bg-green-100 text-green-700'
                    : item.status === 'Nonaktif'
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-yellow-100 text-yellow-700'
            }
          `}
                >
                    {item.status}
                </span>
            </div>

            {/* Kanan: Actions */}
            {showActions && (
                <div className='flex items-center gap-4'>
                    <button
                        onClick={() => onEdit(item)}
                        className='text-sm text-blue-600 hover:underline'
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onRemove(item)}
                        className='text-sm text-red-600 hover:underline'
                    >
                        Hapus
                    </button>
                </div>
            )}
        </div>
    );
}
