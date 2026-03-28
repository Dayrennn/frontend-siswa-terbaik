"use client";

import { useState } from "react";
import { useRegisterMutation } from "../../../../hooks/api/userSliceAPI";

export default function FormDataUser({ onSuccess, onCancel }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telephone, setTelephone] = useState("");

  const [register, { isLoading, isError, error }] = useRegisterMutation();

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const result = await register({
        username,
        email,
        password,
        telephone,
      }).unwrap();

      const emailValue = email;

      setUsername("");
      setEmail("");
      setPassword("");
      setTelephone("");

      if (onSuccess) {
        onSuccess(result, {
          email: emailValue,
        });
      }
    } catch (err) {
      console.error("ERROR", err);
    }
  };

  return (
    <form onSubmit={handleCreate} className="space-y-4">
      {/* Username */}
      <div>
        <label className="text-sm text-gray-600">Username</label>
        <input
          type="text"
          placeholder="Masukkan username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none  text-gray-700"
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-sm text-gray-600">Email</label>
        <input
          type="email"
          placeholder="Masukkan email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none  text-gray-700"
        />
      </div>

      {/* Password */}
      <div>
        <label className="text-sm text-gray-600">Password</label>
        <input
          type="password"
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none  text-gray-700"
        />
      </div>

      {/* Telephone */}
      <div>
        <label className="text-sm text-gray-600">Telephone</label>
        <input
          type="text"
          placeholder="Masukkan nomor"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
        />
      </div>

      {/* Button */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          type="button"
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-white text-sm font-medium bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          {isLoading ? "Menyimpan..." : "Simpan Data"}
        </button>
      </div>

      {/* Error */}
      {isError && (
        <p className="text-red-500 text-sm text-center">
          {error?.data?.message || "Terjadi kesalahan"}
        </p>
      )}
    </form>
  );
}
