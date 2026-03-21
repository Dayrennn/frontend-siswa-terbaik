import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../lib/baseQuery";

export const siswaAPI = createApi({
  reducerPath: "siswaAPI",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery,
  tagTyoes: ["siswaAPI"],
  endpoints: (builder) => ({
    createSiswa: builder.mutation({
      query: (data) => ({
        url: "/siswa/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["siswaAPI"],
    }),
    modifySiswa: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/siswa/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["siswaAPI"],
    }),
    seeAllSiswa: builder.query({
      query: () => "/siswa",
      provideTags: ["siswaAPI"],
    }),
    getSiswaById: builder.query({
      query: (id) => `/siswa/${id}`,
      provideTags: ["siswaAPI"],
    }),
  }),
});

export const {
  useCreateSiswaMutation,
  useModifySiswaMutation,
  useSeeAllSiswaQuery,
  useGetSiswaByIdQuery,
} = siswaAPI;
