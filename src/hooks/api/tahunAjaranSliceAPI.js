import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../lib/baseQuery";

export const tahunAjaranAPI = createApi({
  reducerPath: "tahunAjaranAPI",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery,
  endpoints: (builder) => ({
    createTahunAjaran: builder.mutation({
      query: (data) => ({
        url: "/tahun-ajaran/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["tahunAjaranAPI"],
    }),
    modifyTahunAjaran: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/tahun-ajaran/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["tahunAjaranAPI"],
    }),
    seeAllTahunAjaran: builder.query({
      query: () => "/tahun-ajaran",
      providesTags: ["tahunAjaranAPI"],
    }),
    getTahunAajaranById: builder.query({
      query: (id) => `/tahun-ajaran/${id}`,
      providesTags: ["tahunAjaranAPI"],
    }),
    removeTahunAjaran: builder.mutation({
      query: (id) => ({
        url: `/tahun-ajaran/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tahunAjaranAPI"],
    }),
  }),
});

export const {
  useCreateTahunAjaranMutation,
  useModifyTahunAjaranMutation,
  useSeeAllTahunAjaranQuery,
  useGetTahunAajaranByIdQuery,
  useRemoveTahunAjaranMutation,
} = tahunAjaranAPI;
