import { createApi } from "@reduxjs/toolkit/query/react";
import { kehadiranBaseQuery } from "../lib/baseQuery";

export const kehadiranAPI = createApi({
  reducerPath: "kehadiranAPI",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: kehadiranBaseQuery,
  tagTypes: ["kehadiranAPI"],
  endpoints: (builder) => ({
    createKehadiran: builder.mutation({
      query: (data) => ({
        url: "/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["kehadiranAPI"],
    }),
    modifyKehadiran: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/update/${id}`,
        method: "PUT",
        bodt: data,
      }),
      invalidatesTags: ["kehadiranAPi"],
    }),
    seeAllKehadiran: builder.query({
      query: () => "/",
      providesTags: ["kehadiranAPI"],
    }),
    getKehadiranById: builder.query({
      query: (id) => `/${id}`,
      providesTags: ["kehadiranAPI"],
    }),
  }),
});

export const {
  useCreateKehadiranMutation,
  useModifyKehadiranMutation,
  useSeeAllKehadiranQuery,
  useGetKehadiranByIdQuery,
} = kehadiranAPI;
