function minutesToTime(minutes) {
    const h = Math.floor(minutes / 60)
        .toString()
        .padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
}

export default function JadwalCard({ jadwal, onEdit, onRemove }) {
    const { hari, jamMulai, jamSelesai, kelas, pelajaran } = jadwal;

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-800 px-3 py-1 rounded-lg">
                    📅 {hari}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg">
                    📚 {pelajaran.kodePelajaran}
                </span>
            </div>

            {/* Nama pelajaran & kelas */}
            <div>
                <p className="text-sm font-medium text-gray-800">{pelajaran.namaPelajaran}</p>
                <p className="text-xs text-gray-500">
                    Kelas {kelas.namaKelas} · {kelas.kodeKelas}
                </p>
            </div>

            <hr className="border-gray-100" />

            {/* Jam */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <p className="text-xs text-gray-400 mb-0.5">Jam Mulai</p>
                    <p className="text-sm font-medium text-gray-800">{minutesToTime(jamMulai)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 mb-0.5">Jam Selesai</p>
                    <p className="text-sm font-medium text-gray-800">{minutesToTime(jamSelesai)}</p>
                </div>
            </div>
            {/* Actions */}
            <hr className="border-gray-100" />
            <div className="flex gap-2">
                <button
                    onClick={() => onEdit(jadwal)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                    ✏️ Edit
                </button>
                <button
                    onClick={() => onRemove(jadwal)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                    🗑️ Hapus
                </button>
            </div>
        </div>
    );
}
