"use client";

import { FaCheckCircle } from "react-icons/fa";

export default function SuccessModal({
  title = "Berhasil!",
  message = "Data berhasil disimpan",
  onClose,
  showButton = true,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-80 mx-4">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
            <FaCheckCircle className="text-green-500 text-xl" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-gray-800 font-bold text-lg mb-1">
          {title}
        </h2>

        {/* Message */}
        <p className="text-center text-gray-500 text-sm mb-6">{message}</p>

        {/* Button */}
        {showButton && (
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
          >
            Oke
          </button>
        )}
      </div>
    </div>
  );
}
