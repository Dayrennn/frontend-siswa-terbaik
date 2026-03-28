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
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    update: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/auth/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["userAPI", "me"],
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
    getMe: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["me"],
    }),
    removeUser: builder.mutation({
      query: (id) => ({
        url: `/auth/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["userAPI"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useUpdateMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetMeQuery,
  useLogoutMutation,
  useRemoveUserMutation,
} = userAPI;
