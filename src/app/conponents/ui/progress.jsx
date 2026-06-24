export default function JuzProgress({ jumlahJuz = 0 }) {
    const TOTAL_JUZ = 30;
    const segments = Array.from({ length: TOTAL_JUZ }, (_, i) => i < jumlahJuz);

    return (
        <div>
            <div className="mb-1.5 flex items-baseline justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-stone-400">Hafalan</span>
                <span className="font-serif text-lg leading-none text-[#0F4C42]">
                    {jumlahJuz}
                    <span className="text-sm font-normal text-stone-400">/{TOTAL_JUZ} juz</span>
                </span>
            </div>
            <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${TOTAL_JUZ}, minmax(0, 1fr))` }}>
                {segments.map((filled, i) => (
                    <span key={i} className={`h-2.5 rounded-[1px] ${filled ? 'bg-[#C99B4B]' : 'bg-stone-200'}`} />
                ))}
            </div>
        </div>
    );
}
