function formatCreatedAt(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatTanggal(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function PertemuanCard({ item, onLihat, onEdit, onHapus }) {
    return (
        <div className="group bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md hover:border-blue-200 transition-all duration-200">
            {/* Header card */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        {/* Icon Calendar */}
                        <svg
                            className="w-5 h-5 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.6}
                        >
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm leading-tight truncate">
                            {item.namaPertemuan}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Dibuat {formatCreatedAt(item.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Aksi */}
                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={() => onLihat(item)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="Lihat kehadiran"
                    >
                        {/* Icon Eye */}
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.6}
                        >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onEdit(item)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                        title="Edit pertemuan"
                    >
                        {/* Icon Edit */}
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.6}
                        >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onHapus(item)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Hapus pertemuan"
                    >
                        {/* Icon Trash */}
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.6}
                        >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-100" />

            {/* Info detail */}
            <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                    <p className="text-gray-400 mb-0.5">Tanggal</p>
                    <p className="font-medium text-gray-700">{formatTanggal(item.tanggal)}</p>
                </div>
                <div>
                    <p className="text-gray-400 mb-0.5">Tahun ajaran</p>
                    <p className="font-medium text-gray-700">{item.tahunAjaran.namaTahunAjaran}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-gray-400 mb-0.5">Kelas</p>
                    <div className="flex items-center gap-1.5">
                        {/* Icon School */}
                        <svg
                            className="w-3.5 h-3.5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.6}
                        >
                            <path d="M3 9.5 12 4l9 5.5v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9Z" />
                            <path d="M9 22V12h6v10" />
                        </svg>
                        <p className="font-medium text-gray-700">
                            {item.kelas.kodeKelas} – {item.kelas.namaKelas}
                        </p>
                    </div>
                </div>
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-2">
                <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                        item.tahunAjaran.status === 'Aktif'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-gray-100 text-gray-500'
                    }`}
                >
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${
                            item.tahunAjaran.status === 'Aktif' ? 'bg-emerald-500' : 'bg-gray-400'
                        }`}
                    />
                    {item.tahunAjaran.status}
                </span>

                <span className="text-xs text-gray-300">·</span>
                <span className="text-xs text-gray-400">ID: {item.id.slice(0, 8)}…</span>
            </div>
        </div>
    );
}