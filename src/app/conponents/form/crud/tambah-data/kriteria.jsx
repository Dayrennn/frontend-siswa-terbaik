"use client";

import { useState } from "react";
import { useCreateKriteriaMutation } from "../../../../../hooks/api/kriteriaSliceAPI";

export default function FormTambahKriteria({ onSuccess, onCancel }) {
  const [namaKriteria, setNamaKriteria] = useState("");
  const [bobot, setBobot] = useState("");
  const [jenis, setJenis] = useState("");

  const [createKriteria, { isLoading, isError, error }] =
    useCreateKriteriaMutation();

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const result = await createKriteria({
        namaKriteria,
        bobot,
        jenis,
      }).unwrap();

      setNamaKriteria("");
      setBobot("");
      setJenis("");

      // jika sukses (untuk triger modal sukses)
      if (onSuccess) onSuccess(result);
    } catch (err) {
      console.error("ERROR", err);
    }
  };

  return (
    <form onSubmit={handleCreate} className="space-y-4">
      {/* nama kriteria */}
      <div>
        <label className="text-sm text-gray-600">Nama Kriteria</label>
        <input
          type="text"
          placeholder="Masukkan Nama Kriteria"
          value={namaKriteria}
          onChange={(e) => setNamaKriteria(e.target.value)}
          className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none  text-gray-700"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Jenis Kriteria</label>
        <input
          type="text"
          placeholder="Masukkan Jenis Kriteria"
          value={jenis}
          onChange={(e) => setJenis(e.target.value)}
          className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none  text-gray-700"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Bobot</label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="1"
          value={bobot}
          onChange={(e) => setBobot(e.target.value)}
          className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
        />
      </div>

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

      {isError && (
        <p className="text-red-500 text-sm text-center">
          {error?.data?.message || "Terjadi kesalahan"}
        </p>
      )}
    </form>
  );
}
