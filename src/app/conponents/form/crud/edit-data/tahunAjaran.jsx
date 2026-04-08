import { useState } from "react";
import { useModifyTahunAjaranMutation } from "../../../../../hooks/api/tahunAjaranSliceAPI";

export default function FormEditDataTahunAjaran({
  initialData,
  onSuccess,
  onCancel,
}) {
  const [namaTahunAjaran, setNamaTahunAjaran] = useState(
    initialData?.namaTahunAjaran || "",
  );

  const [status, setStatus] = useState(initialData?.status || "Aktif");

  const [updateTahunAjaran, { isLoading, isError, error }] =
    useModifyTahunAjaranMutation();

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const result = await updateTahunAjaran({
        id: initialData.id,
        namaTahunAjaran,
        status,
      }).unwrap();

      // trigger modal sukses
      if (onSuccess) onSuccess(result);
    } catch (err) {
      console.error("ERROR", err);
    }
  };

  return (
    <form onSubmit={handleEdit} className="space-y-4">
      <div>
        <label className="text-sm text-gray-600">Nama Tahun Ajaran</label>
        <input
          type="text"
          placeholder="Masukkan Nama Tahun Ajaran"
          value={namaTahunAjaran}
          onChange={(e) => setNamaTahunAjaran(e.target.value)}
          className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none  text-gray-700"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
        >
          <option value="Aktif">Aktif</option>
          <option value="Nonaktif">Nonaktif</option>
        </select>
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
