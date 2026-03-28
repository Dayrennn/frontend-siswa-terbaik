import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../lib/baseQuery";

export const pelajaranAPI = createApi({
  reducerPath: "pelajaranAPI",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery,
  tagTypes: ["pelajaranAPI"],
  endpoints: (builder) => ({
    createPelajaran: builder.mutation({
      query: (data) => ({
        url: "/pelajaran/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["pelajaranAPI"],
    }),
    modifyPelajaran: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pelajaran/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["pelajaranAPI"],
    }),
    seeAllPelajaran: builder.query({
      query: () => "/pelajaran",
      providesTags: ["pelajaranAPI"],
    }),
    getPelajaranById: builder.query({
      query: (id) => `/update/${id}`,
      providesTags: ["pelajaranAPI"],
    }),
  }),
});

export const {
  useCreatePelajaranMutation,
  useModifyPelajaranMutation,
  useSeeAllPelajaranQuery,
  useGetPelajaranByIdQuery,
} = pelajaranAPI;
