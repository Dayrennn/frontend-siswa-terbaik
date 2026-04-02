"use client";

import {
  useSeeAllSiswaQuery,
  useRemoveSiswaMutation,
} from "../../../../hooks/api/siswaSliceAPI";
import { useState } from "react";

import CreateModal from "../../../conponents/modal/crud/createModal";
import EditModal from "../../../conponents/modal/crud/editModal";
import RemoveModal from "../../../conponents/modal/crud/deleteModal";
import { FaUserPlus } from "react-icons/fa";
import Table from "../../../conponents/table/page";
import FormTambahSiswa from "../../../conponents/form/crud/tambah-data/siswa";
import FormEditDataSiswa from "../../../conponents/form/crud/edit-data/siswa";

export default function DataSiswa() {
  //modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  // hapus pelajaran
  const [deleteSiswa] = useRemoveSiswaMutation();
  const [removeSiswa, setRemoveSiswa] = useState(null);

  const handleRemove = (siswa) => {
    setRemoveSiswa(siswa);
    setShowRemoveModal(true);
  };

  // hit api delete
  const handleDelete = async (id) => {
    await deleteSiswa(id).unwrap();
  };

  // edit siswa
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const handleEdit = (siswa) => {
    setSelectedSiswa(siswa);
    setShowEditModal(true);
  };

  // ambil data
  const { data, isLoading, isError } = useSeeAllSiswaQuery();
  const tableData =
    data?.data?.map((siswa, index) => {
      return {
        no: index + 1,
        ...siswa,
      };
    }) ?? [];

  // ambil semua pelajaran
  const pelajaranMap = new Map();
  data?.data?.forEach((siswa) => {
    siswa.nilai?.forEach((n) => {
      pelajaranMap.set(n.pelajaran.kodePelajaran, n.pelajaran.namaPelajaran);
    });
  });
  const pelajaranList = Array.from(pelajaranMap.entries()).map(
    ([key, label]) => ({ key, label }),
  );

  // kolom dinamis
  const pelajaranColumns = pelajaranList.map((p) => ({
    key: p.key,
    label: p.key,
    render: (row) => {
      const found = row.nilai?.find((n) => n.pelajaran.kodePelajaran === p.key);
      return <span className="text-gray-700">{found?.nilai ?? "-"}</span>;
    },
  }));

  const columns = [
    { key: "no", label: "No" },
    {
      key: "namaSiswa",
      label: "Nama Siswa",
      render: (row) => (
        <span className="text-gray-700">{row.namaSiswa || "-"}</span>
      ),
    },
    {
      key: "tanggalLahir",
      label: "Tanggal Lahir",
      render: (row) => (
        <span className="text-gray-700">
          {row.tanggalLahir?.split("T")[0] || "-"}
        </span>
      ),
    },
    {
      key: "kelas",
      label: "Kelas",
      render: (row) => (
        <span className="text-gray-700">{row.kelas || "-"}</span>
      ),
    },
    ...pelajaranColumns,
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
        <h1 className="text-2xl font-bold text-gray-800">Data Siswa</h1>

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
          title="Tambah Siswa"
          formTambah={FormTambahSiswa}
          successTitle="Siswa Berhasil Dibuat"
          successMessage="Berhasil"
        />
      )}
      {showEditModal && (
        <EditModal
          onCancel={() => setShowEditModal(false)}
          icon={<FaUserPlus />}
          title="Edit Siswa"
          formEdit={FormEditDataSiswa}
          initialData={selectedSiswa}
          successTitle="Siswa Berhasil di Update"
          successMessage="Berhasil"
        />
      )}
      {showRemoveModal && (
        <RemoveModal
          onCancel={() => setShowRemoveModal(false)}
          icon={<FaUserPlus />}
          title="Hapus Siswa"
          initialData={removeSiswa}
          displayName="namaSiswa"
          onConfirm={handleDelete}
          successTitle="Siswa Berhasil di Hapus"
          successMessage="Berhasil"
        />
      )}
    </>
  );
}
