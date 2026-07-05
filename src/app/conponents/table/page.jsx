export default function Table({ columns = [], data = [] }) {
    return (
        <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                <table className="w-full min-w-[640px] text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            {columns.filter(Boolean).map((col) => (
                                <th
                                    key={col.key}
                                    className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap"
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.filter(Boolean).length} className="text-center text-gray-400 py-8">
                                    Tidak ada data
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                                    {columns.filter(Boolean).map((col) => (
                                        <td key={col.key} className="px-5 py-3 text-gray-700">
                                            {col.render ? col.render(row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="md:hidden pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white via-white/70 to-transparent" />
        </div>
    );
}
