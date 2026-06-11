'use client';

const STATUS_STYLE = {
    Baik: 'bg-green-50 text-green-700',
    Perhatian: 'bg-amber-50 text-amber-700',
    Peringatan: 'bg-red-50 text-red-700',
};

function getStatus(poin) {
    if (poin === 0) return 'Baik';
    if (poin < 20) return 'Perhatian';
    return 'Peringatan';
}

function getInitials(nama) {
    return nama?.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() ?? '?';
}

function formatTanggal(iso) {
    return iso?.split('T')[0] ?? '-';
}

export default function DetailPoin({ selectedSiswa, activeTab, setActiveTab, onClose }) {
    if (!selectedSiswa) return null;

    const totalPoinPlus = selectedSiswa.poinPlus.reduce((acc, p) => acc + p.poin, 0);
    const totalPoinMinus = selectedSiswa.poinMinus.reduce((acc, p) => acc + p.poin, 0);
    const status = getStatus(totalPoinMinus);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-5 text-white flex items-center justify-between rounded-t-2xl flex-shrink-0">
                    <h2 className="font-semibold text-sm">Detail Poin Siswa</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-lg">✕</button>
                </div>

                <div className="p-5 overflow-y-auto space-y-4">
                    {/* Info Siswa */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                            {getInitials(selectedSiswa.namaSiswa)}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 text-sm">{selectedSiswa.namaSiswa}</p>
                            <p className="text-xs text-gray-400">
                                NIS: {selectedSiswa.nis ?? '-'} · {selectedSiswa.kelas?.kodeKelas}{' '}
                                {selectedSiswa.kelas?.namaKelas}
                            </p>
                        </div>
                        <span className={`ml-auto inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[status]}`}>
                            ● {status}
                        </span>
                    </div>

                    {/* Ringkasan */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-green-50 rounded-xl px-4 py-3">
                            <p className="text-xs text-green-600 mb-1">Total Poin Plus</p>
                            <p className="text-2xl font-medium text-green-700">+{totalPoinPlus}</p>
                        </div>
                        <div className="bg-red-50 rounded-xl px-4 py-3">
                            <p className="text-xs text-red-600 mb-1">Total Poin Minus</p>
                            <p className="text-2xl font-medium text-red-700">-{totalPoinMinus}</p>
                        </div>
                    </div>

                    {/* Tab */}
                    <div className="flex gap-2 border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab('plus')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'plus'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            Poin Plus ({selectedSiswa.poinPlus.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('minus')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'minus'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            Poin Minus ({selectedSiswa.poinMinus.length})
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'plus' && (
                        <div className="space-y-2">
                            {selectedSiswa.poinPlus.length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-6">Belum ada poin plus</p>
                            ) : (
                                selectedSiswa.poinPlus.map((p) => (
                                    <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-gray-50">
                                        <div>
                                            <p className="text-sm text-gray-800">{p.deskripsi}</p>
                                            <p className="text-xs text-gray-400">{formatTanggal(p.tanggal)}</p>
                                        </div>
                                        <span className="text-xs font-medium bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full flex-shrink-0 ml-3">
                                            +{p.poin} poin
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'minus' && (
                        <div className="space-y-2">
                            {selectedSiswa.poinMinus.length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-6">Belum ada poin minus</p>
                            ) : (
                                selectedSiswa.poinMinus.map((p) => (
                                    <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-gray-50">
                                        <div>
                                            <p className="text-sm text-gray-800">{p.deskripsi}</p>
                                            <p className="text-xs text-gray-400">{formatTanggal(p.tanggal)}</p>
                                        </div>
                                        <span className="text-xs font-medium bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full flex-shrink-0 ml-3">
                                            -{p.poin} poin
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}