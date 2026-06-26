export default function AbsenCard({ rekap, onEdit, user }) {
    const isAdmin = user?.role === 'Admin';
    // const isGuru = user?.role === 'Guru';
    const isOwnerGuru = user?.pelajaran?.some((akses) => akses.pelajaran?.id === rekap.pelajaran.id) ?? false;

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <svg
                            className="w-4 h-4 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.6}
                        >
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
                {(isAdmin || isOwnerGuru) && (
                    <button
                        onClick={() => onEdit(rekap)}
                        className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors font-medium"
                    >
                        Edit
                    </button>
                )}
            </div>

            <div className="grid grid-cols-5 gap-2 mb-4">
                {[
                    { label: 'Pertemuan', value: rekap.totalPertemuan, color: 'bg-gray-50 text-gray-700' },
                    { label: 'Hadir', value: rekap.totalHadir, color: 'bg-green-50 text-green-700' },
                    { label: 'Sakit', value: rekap.totalSakit, color: 'bg-blue-50 text-blue-700' },
                    { label: 'Izin', value: rekap.totalIzin, color: 'bg-amber-50 text-amber-700' },
                    {
                        label: 'Alpha',
                        value: rekap.totalAlpha,
                        color: rekap.totalAlpha > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-700',
                    },
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
