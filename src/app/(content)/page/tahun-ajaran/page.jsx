"use client";

import {
  useSeeAllTahunAjaranQuery,
  useRemoveTahunAjaranMutation,
} from "../../../../hooks/api/tahunAjaranSliceAPI";

import FormTambahTahunAjaran from "../../../conponents/form/crud/tambah-data/tahunAjaran";
import CreateModal from "../../../conponents/modal/crud/createModal";
import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import EditModal from "../../../conponents/modal/crud/editModal";
import RemoveModal from "../../../conponents/modal/crud/deleteModal";
import FormEditDataTahunAjaran from "../../../conponents/form/crud/edit-data/tahunAjaran";
import TahunAjaranCard from "../../../conponents/card/tahunAjaranCard";

export default function TahunAjaran() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  // edit tahun ajaran
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState(null);
  const handleEdit = (tahunAjaran) => {
    setSelectedTahunAjaran(tahunAjaran);
    setShowEditModal(true);
  };

  // hapus tahun ajaran
  const [deleteTahunAjaran] = useRemoveTahunAjaranMutation();
  const [removeTahunAjaran, setRemoveTahunAjaran] = useState(null);
  const handleRemove = (tahunAjaran) => {
    setRemoveTahunAjaran(tahunAjaran);
    setShowRemoveModal(true);
  };

  // ambil data
  const { data, isLoading, isError } = useSeeAllTahunAjaranQuery();

  const tahunAjaranData = data?.data ?? [];

  return (
    <>
      <div className="min-h-screen bg-gray-100 px-4 py-6">
        <div className="mx-auto max-w-7xl bg-white p-6 shadow-md rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Data Tahun Ajaran
            </h1>

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow"
            >
              + Tambah Tahun
            </button>
          </div>

          {/* Grid Card */}
          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : isError ? (
            <p className="text-center text-red-500">Gagal mengambil data</p>
          ) : tahunAjaranData.length === 0 ? (
            <p className="text-center text-gray-500">Belum ada data</p>
          ) : (
            <div className="flex flex-col gap-3 w-full">
              {tahunAjaranData.map((item) => (
                <TahunAjaranCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {showCreateModal && (
        <CreateModal
          onCancel={() => setShowCreateModal(false)}
          icon={<FaUserPlus />}
          title="Tambah Tahun Ajaran"
          formTambah={FormTambahTahunAjaran}
          successTitle="Tahun Ajaran Berhasil Ditambahkan"
          successMessage="Berhasil"
        />
      )}
      {showEditModal && (
        <EditModal
          onCancel={() => setShowEditModal(false)}
          icon={<FaUserPlus />}
          title="Edit Tahun Ajaran"
          formEdit={FormEditDataTahunAjaran}
          initialData={selectedTahunAjaran}
          successTitle="Tahun Ajaran Berhasil Diubah"
          successMessage="Berhasil"
        />
      )}
      {showRemoveModal && (
        <RemoveModal
          onCancel={() => setShowRemoveModal(false)}
          icon={<FaUserPlus />}
          initialData={removeTahunAjaran}
          title="Hapus Tahun Ajaran"
          displayName="namaTahunAjaran"
          onConfirm={() => deleteTahunAjaran(removeTahunAjaran.id)}
          successTitle="Tahun Ajaran Berhasil Dihapus"
          successMessage="Berhasil"
        />
      )}
    </>
  );
}
