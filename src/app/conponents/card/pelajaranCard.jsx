export default function PelajaranCard({ item, onEdit, onRemove, user }) {
    const isAdmin = user?.role === 'Admin';
    const isWakilKepalaSekolah = user?.role === 'WakilKepalaSekolah';

    const guruName = item.guru?.length > 0 ? item.guru.map((g) => g.guru?.username).join(', ') : null;

    return (
        <div className="group relative bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-lg hover:border-gray-200 transition-all duration-200">
            {/* Aksen warna atas */}
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-blue-400" />

            {/* Header */}
            <div className="flex items-start justify-between gap-2 pt-1">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-blue-100 text-blue-600">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.6}
                        >
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm leading-snug truncate">
                            {item.namaPelajaran}
                        </p>
                        <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            {item.kodePelajaran}
                        </span>
                    </div>
                </div>
            </div>

            {/* Guru */}
            <div className="flex items-center gap-2 text-xs rounded-lg px-3 py-2 bg-blue-50">
                <span className="text-gray-400 shrink-0">
                    <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.6}
                    >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </span>
                <span className={`truncate ${guruName ? 'text-gray-700 font-medium' : 'text-gray-400 italic'}`}>
                    {guruName ?? 'Belum ada guru'}
                </span>
            </div>

            {/* Divider */}
            <hr className="border-gray-100" />

            {/* Aksi */}
            {(isAdmin || isWakilKepalaSekolah) && (
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEdit(item);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                    >
                        <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                        >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" />
                        </svg>
                        Edit
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onRemove(item);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    >
                        <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                        >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                        Hapus
                    </button>
                </div>
            )}
        </div>
    );
}
