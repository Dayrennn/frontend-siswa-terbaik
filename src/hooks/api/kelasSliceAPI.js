import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../lib/baseQuery";

export const kelasAPI = createApi({
  reducerPath: "kelasAPI",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery,
  tagTypes: ["kelasAPI"],
  endpoints: (builder) => ({
    createKelas: builder.mutation({
      query: (data) => ({
        url: "/kelas/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["kelasAPI"],
    }),
    modifyKelas: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/kelas/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["kelasAPI"],
    }),
    getAllKelas: builder.query({
      query: () => `/kelas`,
      providesTags: ["kelasAPI"],
    }),
    getKelasById: builder.query({
      query: () => ({
        url: `/kelas/${id}`,
        providesTags: ["kelasAPI"],
      }),
    }),
    removeKelas: builder.mutation({
      query: (id) => ({
        url: `/kelas/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["kelasAPI"],
    }),
  }),
});

export const {
  useCreateKelasMutation,
  useModifyKelasMutation,
  useGetAllKelasQuery,
  useGetKelasByIdQuery,
  useRemoveKelasMutation,
} = kelasAPI;
