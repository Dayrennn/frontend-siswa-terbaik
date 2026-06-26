export default function NilaiCard({ rekap, onEdit, user, kelasId }) {
    const isOwnerGuru = user?.pelajaran?.some((akses) => akses.pelajaran?.id === rekap.pelajaran.id) ?? false;
    const isAdmin = user?.role === 'Admin';
    const isOwnerWaliKelas = user?.waliKelas?.some((kelas) => kelas.id === kelasId) ?? false;
    const canEdit = isAdmin || isOwnerWaliKelas || isOwnerGuru;

    const keteranganColor = {
        'Sangat Baik': 'bg-green-50 text-green-700',
        'Baik': 'bg-blue-50 text-blue-700',
        'Cukup': 'bg-amber-50 text-amber-700',
        'Buruk': 'bg-red-50 text-red-600',
        'Sangat Buruk': 'bg-red-100 text-red-700',
    };

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">{rekap.pelajaran.namaPelajaran}</p>
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                            {rekap.pelajaran.kodePelajaran}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {rekap.keterangan && (
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${keteranganColor[rekap.keterangan] ?? 'bg-gray-50 text-gray-600'}`}>
                            {rekap.keterangan}
                        </span>
                    )}
                    {canEdit && (
                        <button
                            onClick={() => onEdit(rekap)}
                            className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors font-medium"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
                {[
                    { label: 'Nilai Akhir', value: rekap.nilaiAkhir ?? '-', color: 'bg-gray-50 text-gray-700' },
                    { label: 'Tugas', value: rekap.nilaiTugas ?? '-', color: 'bg-green-50 text-green-700' },
                    { label: 'UH', value: rekap.nilaiUH ?? '-', color: 'bg-blue-50 text-blue-700' },
                    { label: 'UTS', value: rekap.nilaiUTS ?? '-', color: 'bg-amber-50 text-amber-700' },
                    { label: 'UAS', value: rekap.nilaiUAS ?? '-', color: 'bg-purple-50 text-purple-700' },
                ].map((item) => (
                    <div key={item.label} className={`text-center rounded-xl py-2 px-1 ${item.color}`}>
                        <p className="text-base font-medium">{item.value}</p>
                        <p className="text-xs">{item.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}