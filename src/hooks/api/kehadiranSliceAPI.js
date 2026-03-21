import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../lib/baseQuery";

export const kehadiranAPI = createApi({
  reducerPath: "kehadiranAPI",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery,
  tagTypes: ["kehadiranAPI"],
  endpoints: (builder) => ({
    createKehadiran: builder.mutation({
      query: (data) => ({
        url: "/kehadiran/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["kehadiranAPI"],
    }),
    modifyKehadiran: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/kehadiran/update/${id}`,
        method: "PUT",
        bodt: data,
      }),
      invalidatesTags: ["kehadiranAPi"],
    }),
    seeAllKehadiran: builder.query({
      query: () => "/kehadiran",
      providesTags: ["kehadiranAPI"],
    }),
    getKehadiranById: builder.query({
      query: (id) => `/kehadiran/${id}`,
      providesTags: ["kehadiranAPI"],
    }),
  }),
});

export const {
  useCreateKehadiranMutation,
  useModifyKehadiranMutation,
  useSeeAllKehadiranQuery,
  useGetKehadiranById,
} = kehadiranAPI;
