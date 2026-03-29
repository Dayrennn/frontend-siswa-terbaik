"use client";

import {
  useRemovePelajaranMutation,
  useSeeAllPelajaranQuery,
} from "../../../../hooks/api/pelajaranSliceAPI";
import Table from "../../../conponents/table/page";
import CreateModal from "../../../conponents/modal/crud/createModal";
import EditModal from "../../../conponents/modal/crud/editModal";
import RemoveModal from "../../../conponents/modal/crud/deleteModal";
import FormTambahPelajaran from "../../../conponents/form/crud/tambah-data/pelajaran";
import { FaUserPlus } from "react-icons/fa";
import { useState } from "react";
import FormEditDataPelajaran from "../../../conponents/form/crud/edit-data/pelajaran";

export default function DataPelajaran() {
  //modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  // hapus pelajaran
  const [deletePelajaran] = useRemovePelajaranMutation();
  const [removeItem, setRemoveItem] = useState(null);
  // simpan data dan buka modal
  const handleRemove = (pelajaran) => {
    setRemoveItem(pelajaran);
    setShowRemoveModal(true);
  };
  // hit api delete
  const handleDelete = async (id) => {
    await deletePelajaran(id).unwrap();
  };

  // edit user
  const [selectedPelajaran, setSelectedPelajaran] = useState(null);
  const handleEdit = (pelajaran) => {
    setSelectedPelajaran(pelajaran);
    setShowEditModal(true);
  };

  // ambil data
  const { data, isLoading, isError } = useSeeAllPelajaranQuery();
  const tableData =
    data?.data?.map((item, index) => {
      return {
        no: index + 1,
        ...item,
      };
    }) ?? [];

  const columns = [
    { key: "no", label: "No" },
    {
      key: "namaPelajaran",
      label: "Pelajaran",
      render: (row) => (
        <span className="text-gray-700">{row.namaPelajaran || "-"}</span>
      ),
    },
    {
      key: "kodePelajaran",
      label: "Kode Pelajaran",
      render: (row) => (
        <span className="text-gray-700">{row.kodePelajaran || "-"}</span>
      ),
    },
    {
      key: "aksi",
      label: "Aksi",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-xs bg-yellow-100 text-yellow-600 px-3 py-1 rounded-lg hover:bg-yellow-200 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleRemove(row)}
            className="text-xs bg-red-100 text-red-500 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Data Pelajaran</h1>

        <div className="flex justify-end mt-5 mb-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            + Tambah
          </button>
        </div>

        {isLoading && (
          <p className="text-center text-gray-400 py-8">Memuat Data...</p>
        )}

        {isError && (
          <p className="text-center text-red-400 py-8">Gagal Memuat Data</p>
        )}

        {!isLoading && !isError && <Table columns={columns} data={tableData} />}
      </div>

      {showCreateModal && (
        <CreateModal
          onCancel={() => setShowCreateModal(false)}
          icon={<FaUserPlus />}
          title="Tambah Pelajaran"
          formTambah={FormTambahPelajaran}
          successTitle="Pelajaran Berhasil Dibuat"
          successMessage="Berhasil"
        />
      )}
      {showEditModal && (
        <EditModal
          onCancel={() => setShowEditModal(false)}
          icon={<FaUserPlus />}
          title="Edit Pelajaran"
          formEdit={FormEditDataPelajaran}
          initialData={selectedPelajaran}
          successTitle="Pelajaran Berhasil di Update"
          successMessage="Berhasil"
        />
      )}
      {showRemoveModal && (
        <RemoveModal
          onCancel={() => setShowRemoveModal(false)}
          icon={<FaUserPlus />}
          title="Hapus Pelajaran"
          initialData={removeItem}
          displayName="namaPelajaran"
          onConfirm={handleDelete}
          successTitle="Pelajaran Berhasil di Hapus"
          successMessage="Berhasil"
        />
      )}
    </>
  );
}
