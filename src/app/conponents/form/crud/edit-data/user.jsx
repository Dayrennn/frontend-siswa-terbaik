"use client";

import { useState } from "react";
import { useUpdateMutation } from "../../../../../hooks/api/userSliceAPI";
import { useSeeAllPelajaranQuery } from "../../../../../hooks/api/pelajaranSliceAPI";

const ROLE_OPTIONS = [
  { value: "Admin", label: "Admin" },
  { value: "WaliKelas", label: "Wali Kelas" },
  { value: "KepalaSekolah", label: "Kepala Sekolah" },
  { value: "WakilKepalaSekolah", label: "Wakil Kepala Sekolah" },
  { value: "Guru", label: "Guru" },
];

export default function FormEditDataUser({ initialData, onSuccess, onCancel }) {
  const [username, setUsername] = useState(initialData?.username || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [password, setPassword] = useState("");
  const [telephone, setTelephone] = useState(initialData?.telephone || "");
  const [role, setRole] = useState(initialData?.role || "Role tidak ada");

  const [updateUser, { isLoading, isError, error }] = useUpdateMutation();

  // BAGIAN EDIT PELAJARAN
  // ambil pelajaran sebagai initialData
  const [selectedPelajaran, setSelectedPelajaran] = useState(
    initialData?.pelajaran?.map((p) => p.id) ?? [],
  );

  // fetch data
  const { data: pelajaranData, isLoading: loadingPelajaran } =
    useSeeAllPelajaranQuery();

  const allPelajaran = pelajaranData?.data ?? [];

  // toggle pilih atau hapus pelajaran
  const togglePelajaran = (id) => {
    setSelectedPelajaran((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        username,
        email,
        telephone,
        role,
        pelajaranId: selectedPelajaran,
      };

      if (password) payload.password = password;

      const result = await updateUser({
        id: initialData.id,
        ...payload,
      }).unwrap();

      if (onSuccess) onSuccess(result);
    } catch (err) {
      console.error("ERROR", err);
    }
  };

  return (
    <form onSubmit={handleEdit} className="space-y-4">
      {/* Username */}
      <div>
        <label className="text-sm text-gray-600">Username</label>
        <input
          type="text"
          placeholder="Masukkan username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
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
          className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
        />
      </div>

      {/* Password */}
      <div>
        <label className="text-sm text-gray-600">
          Password{" "}
          <span className="text-gray-400 text-xs">
            (kosongkan jika tidak diubah)
          </span>
        </label>
        <input
          type="password"
          placeholder="Password baru"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
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

      {/* Role */}
      <div>
        <label className="text-sm text-gray-600">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700 bg-white"
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm text-gray-600">
          Pelajaran <span className="text-gray-400 text-xs">(opsional)</span>
        </label>

        {loadingPelajaran ? (
          <p className="text-xs text-gray-400 mt-1">Memuat pelajaran...</p>
        ) : (
          <div className="mt-1 border border-gray-200 rounded-lg p-2 max-h-40 overflow-y-auto space-y-1">
            {allPelajaran.length === 0 ? (
              <p className="text-xs text-gray-400">Tidak ada data pelajaran</p>
            ) : (
              allPelajaran.map((p) => (
                <label
                  key={p.id}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPelajaran.includes(p.id)}
                    onChange={() => togglePelajaran(p.id)}
                    className="accent-indigo-500"
                  />
                  <span className="text-sm text-gray-700">
                    {p.namaPelajaran}
                    <span className="text-xs text-gray-400 ml-1">
                      ({p.kodePelajaran})
                    </span>
                  </span>
                </label>
              ))
            )}
          </div>
        )}

        {selectedPelajaran.length > 0 && (
          <p className="text-xs text-indigo-500 mt-1">
            {selectedPelajaran.length} pelajaran dipilih
          </p>
        )}
      </div>

      {/* Buttons */}
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
          className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-medium bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
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
