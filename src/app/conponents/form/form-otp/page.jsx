"use client";

import { useState } from "react";
import { useVerifyOtpMutation } from "../../../../hooks/api/userSliceAPI";

export default function FormOtp({ email, onCancel, onSuccess }) {
  const [otp, setOtp] = useState("");
  const [verifyOtp, { isLoading, isError, error }] = useVerifyOtpMutation();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp({
        email,
        otp,
      }).unwrap();

      onSuccess?.();
    } catch (err) {
      console.error("Terjadi kesalahan", err);
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-4 text-center">
      <p className="text-sm text-gray-500">
        Masukkan kode OTP yang dikirim ke email
      </p>

      <input
        type="text"
        placeholder="Masukkan OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full text-center tracking-widest text-lg px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-700"
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-gray-700"
        >
          Batal
        </button>

        <button
          type="submit"
          className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white"
        >
          Verifikasi
        </button>
      </div>
      {isError && (
        <p className="text-red-500 text-sm text-center">
          {error?.data?.message || "Terjadi kesalahan"}
        </p>
      )}
    </form>
  );
}
