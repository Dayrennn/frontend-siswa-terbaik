import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../lib/baseQuery";

export const kriteriaAPI = createApi({
  reducerPath: "kriteriaAPI",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery,
  tagTypes: ["kriteriaAPI"],
  endpoints: (builder) => ({
    createKriteria: builder.mutation({
      query: (data) => ({
        url: "/kriteria/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["kriteriaAPI"],
    }),
    modifyKriterea: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/kriteria/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["kriteriaAPI"],
    }),
    getAllKriteria: builder.query({
      query: () => `/kriteria`,
      providesTags: ["kriteriaAPI"],
    }),
    getKriteriaById: builder.query({
      query: (id) => `/kriteria/${id}`,
      providesTags: ["kriteriaAPI"],
    }),
  }),
});

export const {
  useCreateKriteriaMutation,
  useModifyKritereaMutation,
  useGetAllKriteriaQuery,
  useGetKriteriaById,
} = kriteriaAPI;
