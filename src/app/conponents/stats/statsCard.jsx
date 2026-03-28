export default function StatsCard({ title, icon: Icon, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
        <Icon className="text-indigo-600 text-xl" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
