"use client";

import {
  useSeeAllSiswaQuery,
  useRemoveSiswaMutation,
} from "../../../../hooks/api/siswaSliceAPI";
import { useState, useRef } from "react";

import CreateModal from "../../../conponents/modal/crud/createModal";
import EditModal from "../../../conponents/modal/crud/editModal";
import RemoveModal from "../../../conponents/modal/crud/deleteModal";
import { FaUserPlus } from "react-icons/fa";
import Table from "../../../conponents/table/page";
import FormTambahSiswa from "../../../conponents/form/crud/tambah-data/siswa";
import FormEditDataSiswa from "../../../conponents/form/crud/edit-data/siswa";
import {
  exportToExcel,
  downloadTemplate,
  parseImportedExcel,
} from "../../../../hooks/utils/excelHelper";
import TahunAjaranCard from "../../../conponents/card/tahunAjaranCard";
import { useSeeAllTahunAjaranQuery } from "../../../../hooks/api/tahunAjaranSliceAPI";
import Link from "next/link";

export default function DataSiswa() {
  //modal

  const { data, isLoading, isError } = useSeeAllTahunAjaranQuery();

  const tahunAjaranData = data?.data ?? [];

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-7xl bg-white p-6 shadow-md rounded-xl">
          <h1 className="text-2xl font-bold text-gray-800">Data Siswa</h1>
          <div className="flex justify-between items-center mt-4 mb-4">
            <p className="text-gray-600 text-sm">
              Pilih Tahun Ajaran atau lihat semua data siswa
            </p>

            <Link
              href="/page/data-siswa/all-siswa"
              className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Tampilkan Semua
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-5 mb-3">
            {isLoading ? (
              <div className="animate-pulse">Loading data...</div>
            ) : isError ? (
              <p className="text-red-500">Gagal mengambil data</p>
            ) : tahunAjaranData.length === 0 ? (
              <p>Tidak ada data</p>
            ) : (
              tahunAjaranData.map((item) => (
                <Link
                  key={item.id}
                  href={`/page/data-siswa/${item.id}`}
                  className="block"
                >
                  <TahunAjaranCard item={item} showActions={false} />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
