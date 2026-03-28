import { FaSignOutAlt } from "react-icons/fa";

export default function LogoutModal({ onConfirm, onCancel, isLoading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-80 mx-4">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
            <FaSignOutAlt className="text-red-500 text-xl" />
          </div>
        </div>
        <h2 className="text-center text-gray-800 font-bold text-lg mb-1">
          Keluar dari Akun?
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Kamu akan keluar dari sesi ini. Pastikan pekerjaanmu sudah tersimpan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            {isLoading ? "Loading..." : "Ya, Keluar"}
          </button>
        </div>
      </div>
    </div>
  );
}
