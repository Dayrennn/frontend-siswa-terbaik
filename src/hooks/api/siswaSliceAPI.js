import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../lib/baseQuery";

export const siswaAPI = createApi({
  reducerPath: "siswaAPI",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery,
  tagTypes: ["siswaAPI"],
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
      providesTags: ["siswaAPI"],
    }),
    getSiswaById: builder.query({
      query: (id) => `/siswa/${id}`,
      providesTags: ["siswaAPI"],
    }),
    removeSiswa: builder.mutation({
      query: (id) => ({
        url: `/siswa/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["siswaAPI"],
    }),
  }),
});

export const {
  useCreateSiswaMutation,
  useModifySiswaMutation,
  useSeeAllSiswaQuery,
  useGetSiswaByIdQuery,
  useRemoveSiswaMutation,
} = siswaAPI;
