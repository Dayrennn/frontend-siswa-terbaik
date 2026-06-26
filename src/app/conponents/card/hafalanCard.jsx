import { PencilIcon } from 'lucide-react';
import JuzProgress from '../ui/progress';

export default function HafalanCard({ siswa, onEdit, user }) {
    const isAdmin = user?.role === 'Admin';
    const WaliKelas = user?.role === 'Guru';
    const initial = siswa.namaSiswa?.charAt(0)?.toUpperCase() ?? '?';

    return (
        <div className="group relative rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-[#0F4C42]/30">
            {isAdmin ||
                (WaliKelas && (
                    <button
                        type="button"
                        onClick={() => onEdit(siswa)}
                        className="absolute right-4 top-4 rounded-md p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-[#0F4C42]"
                    >
                        <PencilIcon className="h-4 w-4" />
                    </button>
                ))}

            <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0F4C42] font-serif text-lg text-[#F8F5EE]">
                    {initial}
                </div>
                <div className="min-w-0">
                    <h3 className="truncate font-serif text-lg text-stone-800">{siswa.namaSiswa}</h3>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500">
                        <span className="inline-flex items-center rounded-full bg-[#0F4C42]/10 px-2 py-0.5 font-medium text-[#0F4C42]">
                            {siswa.kelas?.namaKelas ?? 'Kelas -'}
                            {siswa.kelas?.kodeKelas ? ` · ${siswa.kelas.kodeKelas}` : ''}
                        </span>
                        <span>{siswa.tahunAjaran?.namaTahunAjaran ?? '-'}</span>
                    </div>
                </div>
            </div>

            {siswa.hafalan ? (
                <>
                    <JuzProgress jumlahJuz={siswa.hafalan.jumlahJuz} />
                    {siswa.hafalan.keterangan && (
                        <p className="mt-3 border-t border-stone-100 pt-3 text-sm text-stone-500">
                            {siswa.hafalan.keterangan}
                        </p>
                    )}
                </>
            ) : (
                <div className="rounded-md bg-stone-50 px-3 py-2.5 text-sm text-stone-400">
                    Belum ada catatan hafalan
                </div>
            )}
        </div>
    );
}
