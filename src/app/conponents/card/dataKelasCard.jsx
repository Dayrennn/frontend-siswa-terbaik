export default function DataKelasCard({
  item,
  onEdit,
  onRemove,
  showActions = true,
}) {
  return (
    <div
      key={item.id}
      className="bg-white border rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-all duration-300 w-full flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-semibold text-gray-800">
          {item.kodeKelas}
        </h2>
        <h2 className="text-sm font-semibold text-gray-800">
          {item.namaKelas}
        </h2>
      </div>

      {/* Kanan: Actions */}
      {showActions && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => onEdit(item)}
            className="text-sm text-blue-600 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => onRemove(item)}
            className="text-sm text-red-600 hover:underline"
          >
            Hapus
          </button>
        </div>
      )}
    </div>
  );
}
