"use client";

import {
  useGetUsersQuery,
  useRemoveUserMutation,
} from "../../../../hooks/api/userSliceAPI";
import CreateModal from "../../../conponents/modal/crud/createModal";
import EditModal from "../../../conponents/modal/crud/editModal";
import Table from "../../../conponents/table/page";
import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import FormTambahUser from "../../../conponents/form/crud/tambah-data/user";
import FormEditUser from "../../../conponents/form/crud/edit-data/user";
import FormOtp from "../../../conponents/form/form-otp/page";
import RemoveModal from "../../../conponents/modal/crud/deleteModal";

export default function DataUser() {
  // modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  // hapus user
  const [deleteUser] = useRemoveUserMutation();
  const [removeUser, setRemoveUser] = useState(null);
  // simpan data dan buka modal
  const handleRemove = (user) => {
    setRemoveUser(user);
    setShowRemoveModal(true);
  };

  // hit api delete
  const handleDelete = async (id) => {
    await deleteUser(id).unwrap();
  };

  // edit user
  const [selectedUser, setSelectedUser] = useState(null);
  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // ambil data dari api
  const { data, isLoading, isError } = useGetUsersQuery();
  const tableData =
    data?.data?.map((user, index) => {
      return {
        no: index + 1,
        ...user,
      };
    }) ?? [];

  const columns = [
    { key: "no", label: "No" },
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    {
      key: "pelajaran",
      label: "Pelajaran",
      render: (row) => (
        <span className="text-gray-700">
          {Array.isArray(row.pelajaran) && row.pelajaran.length > 0
            ? row.pelajaran.map((p) => p.namaPelajaran).join(", ")
            : row.pelajaran?.namaPelajaran || "-"}
        </span>
      ),
    },
    {
      key: "kodePelajaran",
      label: "Kode Pelajaran",
      render: (row) => (
        <span className="text-gray-700">
          {Array.isArray(row.pelajaran) && row.pelajaran.length > 0
            ? row.pelajaran.map((p) => p.kodePelajaran).join(", ")
            : row.pelajaran?.kodePelajaran || "-"}
        </span>
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
        <h1 className="text-2xl font-bold text-gray-800">Data User</h1>

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
          title="Tambah User"
          formTambah={FormTambahUser}
          otpComponent={FormOtp}
          successTitle="User Berhasil Dibuat"
          successMessage="Akun telah aktif dan siap digunakan"
        />
      )}
      {showEditModal && (
        <EditModal
          onCancel={() => setShowEditModal(false)}
          icon={<FaUserPlus />}
          title="Edit User"
          formEdit={FormEditUser}
          initialData={selectedUser}
          successTitle="User Berhasil di Update"
          successMessage="User telah di update"
        />
      )}
      {showRemoveModal && (
        <RemoveModal
          onCancel={() => setShowRemoveModal(false)}
          icon={<FaUserPlus />}
          title="Hapus User"
          initialData={removeUser}
          onConfirm={handleDelete}
          displayName="username"
          successTitle="User Berhasil di Update"
          successMessage="User telah di update"
        />
      )}
    </>
  );
}
