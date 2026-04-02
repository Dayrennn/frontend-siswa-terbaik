"use client";

import { useState } from "react";
import { useCreateSiswaMutation } from "../../../../../hooks/api/siswaSliceAPI";

export default function FormTambahSiswa({ onSuccess, onCancel }) {
  const [nis, setNis] = useState("");
  const [namaSiswa, setNamaSiswa] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [kelas, setKelas] = useState("");

  const [createSiswa, { isLoading, isError, error }] = useCreateSiswaMutation();

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createSiswa({
        nis,
        namaSiswa,
        tanggalLahir,
        kelas,
      }).unwrap();

      // reset form
      setNis("");
      setNamaSiswa("");
      setTanggalLahir("");
      setKelas("");

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("ERROR", err);
    }
  };

  return (
    <form onSubmit={handleCreate} className="space-y-4">
      {/* Nis */}
      <div>
        <label className="text-sm text-gray-600">Nis</label>
        <input
          type="text"
          placeholder="Masukkan nis"
          value={nis}
          onChange={(e) => setNis(e.target.value)}
          className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none  text-gray-700"
        />
      </div>

      {/* nama siswa */}
      <div>
        <label className="text-sm text-gray-600">Nama Siswa</label>
        <input
          type="text"
          placeholder="Masukkan nama siswa"
          value={namaSiswa}
          onChange={(e) => setNamaSiswa(e.target.value)}
          className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none  text-gray-700"
        />
      </div>

      {/* tanggal lahir */}
      <div>
        <label className="text-sm text-gray-600">Tanggal Lahir</label>
        <input
          type="date"
          placeholder="Masukkan tanggal lahir"
          value={tanggalLahir}
          onChange={(e) => setTanggalLahir(e.target.value)}
          className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none  text-gray-700"
        />
      </div>

      {/* kelas */}
      <div>
        <label className="text-sm text-gray-600">Kelas</label>
        <input
          type="text"
          placeholder="Masukkan kelas"
          value={kelas}
          onChange={(e) => setKelas(e.target.value)}
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
