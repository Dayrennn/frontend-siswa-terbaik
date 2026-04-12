"use client";

import TahunAjaranCard from "../../../conponents/card/tahunAjaranCard";
import { useSeeAllTahunAjaranQuery } from "../../../../hooks/api/tahunAjaranSliceAPI";
import Link from "next/link";

export default function DataKehadiran() {
  const { data, isLoading, isError } = useSeeAllTahunAjaranQuery();

  const tahunAjaranData = data?.data ?? [];

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-7xl bg-white p-6 shadow-md rounded-xl">
          <h1 className="text-2xl font-bold text-gray-800">Data Kehadiran</h1>

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
                  href={`/page/data-kehadiran/${item.id}`}
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
