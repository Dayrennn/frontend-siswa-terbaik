"use client";

import DataKelasCard from "../../../conponents/card/dataKelasCard";
import CreateModal from "../../../conponents/modal/crud/createModal";
import EditModal from "../../../conponents/modal/crud/editModal";
import RemoveModal from "../../../conponents/modal/crud/deleteModal";

import {
  useGetAllKelasQuery,
  useRemoveKelasMutation,
} from "../../../../hooks/api/kelasSliceAPI";
import { useState } from "react";

import { FaUserPlus } from "react-icons/fa";
import FormTambahDataKelas from "../../../conponents/form/crud/tambah-data/kelas";
import FormEditDataKelas from "../../../conponents/form/crud/edit-data/kelas";

export default function DataKelas() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const [selectedKelas, setSelectedKelas] = useState(null);
  const handleEdit = (kelas) => {
    setSelectedKelas(kelas);
    setShowEditModal(true);
  };

  const [deleteKelas] = useRemoveKelasMutation();
  const [removeKelas, setRemoveKelas] = useState(null);
  const handleRemove = (kelas) => {
    setRemoveKelas(kelas);
    setShowRemoveModal(true);
  };

  // ambil data
  const { data, isLoading, isError } = useGetAllKelasQuery();
  const kelasData = data?.data ?? [];

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-7xl bg-white p-6 shadow-md rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Data Kelas</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow"
            >
              + Tambah Kelas
            </button>
          </div>

          <div className="flex justify-between items-center mt-4 mb-4">
            <p className="text-gray-600 text-sm">Pilih kelas</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-5 mb-3">
            {isLoading ? (
              <div className="animate-pulse">Loading data...</div>
            ) : isError ? (
              <p className="text-red-500">Gagal mengambil data</p>
            ) : kelasData.length === 0 ? (
              <p>Tidak ada data</p>
            ) : (
              kelasData.map((item) => (
                <DataKelasCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onRemove={handleRemove}
                />
              ))
            )}
          </div>
        </div>
      </div>
      {showCreateModal && (
        <CreateModal
          onCancel={() => setShowCreateModal(false)}
          icon={<FaUserPlus />}
          title="Tambah Data Kelas"
          formTambah={FormTambahDataKelas}
          successTitle="Data Kelas Berhasil Ditambahkan"
          successMessage="Berhasil"
        />
      )}
      {showEditModal && (
        <EditModal
          onCancel={() => setShowEditModal(false)}
          icon={<FaUserPlus />}
          title="Edit Data Kelas"
          formEdit={FormEditDataKelas}
          initialData={selectedKelas}
          successTitle="Data Kelas Berhasil Diubah"
          successMessage="Berhasil"
        />
      )}
      {showRemoveModal && (
        <RemoveModal
          onCancel={() => setShowRemoveModal(false)}
          icon={<FaUserPlus />}
          initialData={removeKelas}
          title="Hapus Data Kelas"
          displayName="namaTahunAjaran"
          onConfirm={() => deleteKelas(removeKelas.id)}
          successTitle="Data Kelas Berhasil Dihapus"
          successMessage="Berhasil"
        />
      )}
    </>
  );
}
