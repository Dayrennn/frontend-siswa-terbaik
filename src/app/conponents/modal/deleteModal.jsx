import { useState } from "react";
import SuccessModal from "./successModal";
import { useRemoveUserMutation } from "../../../hooks/api/userSliceAPI";

export default function RemoveModal({
  onCancel,
  icon,
  title,
  successTitle,
  initialData,
  successMessage,
}) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [deleteUser, { isLoading, isError, error }] = useRemoveUserMutation();

  const handleRemove = async () => {
    try {
      await deleteUser(initialData.id).unwrap();
      setShowSuccess(true);
    } catch (err) {
      console.error("Error", err);
    }
  };

  if (showSuccess) {
    return (
      <SuccessModal
        title={successTitle}
        message={successMessage}
        onClose={onCancel}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="font-semibold">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-gray-600 text-sm text-center">
            Apakah kamu yakin ingin menghapus user{" "}
            <span className="font-semibold text-gray-800">
              {initialData?.username}
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </p>

          {isError && (
            <p className="text-red-500 text-sm text-center">
              {error?.data?.message || "Terjadi kesalahan"}
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-60"
            >
              Batal
            </button>
            <button
              onClick={handleRemove}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
            >
              {isLoading ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
