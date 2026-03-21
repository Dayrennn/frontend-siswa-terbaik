import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../lib/baseQuery";

export const userAPI = createApi({
  reducerPath: "userAPI",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery,
  tagTypes: ["userAPI"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["userAPI"],
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["userAPI"],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    update: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/auth/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["userAPI"],
    }),
    getUsers: builder.query({
      query: () => "/auth/users",
      providesTags: ["userAPI"],
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `/auth/users/${id}`,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyOtpMutation,
  useLoginMutation,
  useUpdateMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
} = userAPI;
