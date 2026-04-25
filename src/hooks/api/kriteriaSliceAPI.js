import { createApi } from "@reduxjs/toolkit/query/react";
import { kriteriaBaseQuery } from "../lib/baseQuery";

export const kriteriaAPI = createApi({
  reducerPath: "kriteriaAPI",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: kriteriaBaseQuery,
  tagTypes: ["kriteriaAPI"],
  endpoints: (builder) => ({
    createKriteria: builder.mutation({
      query: (data) => ({
        url: "/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["kriteriaAPI"],
    }),
    modifyKriterea: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["kriteriaAPI"],
    }),
    getAllKriteria: builder.query({
      query: () => `/`,
      providesTags: ["kriteriaAPI"],
    }),
    getKriteriaById: builder.query({
      query: (id) => `/${id}`,
      providesTags: ["kriteriaAPI"],
    }),
    removeKriteria: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["kriteriaAPI"],
    }),
  }),
});

export const {
  useCreateKriteriaMutation,
  useModifyKritereaMutation,
  useGetAllKriteriaQuery,
  useGetKriteriaByIdQuery,
  useRemoveKriteriaMutation,
} = kriteriaAPI;
