export default function TahunAjaranCard({
  item,
  onEdit,
  onRemove,
  showActions = true,
}) {
  return (
    <div
      key={item.id}
      className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Tahun */}
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        {item.namaTahunAjaran}
      </h2>

      {/* Status */}
      <span
        className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-4
          ${
            item.status === "Aktif"
              ? "bg-green-100 text-green-700"
              : item.status === "Nonaktif"
                ? "bg-gray-200 text-gray-700"
                : "bg-yellow-100 text-yellow-700"
          }
        `}
      >
        {item.status}
      </span>

      {/* Action */}
      {showActions && (
        <div className="flex justify-between mt-4">
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
