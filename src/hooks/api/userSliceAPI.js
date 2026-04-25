import { createApi } from '@reduxjs/toolkit/query/react';
import { userBaseQuery } from '../lib/baseQuery';

export const userAPI = createApi({
    reducerPath: 'userAPI',
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: userBaseQuery,
    tagTypes: ['userAPI'],
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: '/register',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['userAPI'],
        }),
        verifyOtp: builder.mutation({
            query: (data) => ({
                url: '/verify-otp',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['userAPI'],
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['userAPI'],
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
            invalidatesTags: ['userAPI'],
        }),
        update: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/users/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['userAPI'],
        }),
        getUsers: builder.query({
            query: () => '/users',
            providesTags: ['userAPI'],
        }),
        getUserById: builder.query({
            query: (id) => `/users/${id}`,
            providesTags: ['userAPI'],
        }),
        getMe: builder.query({
            query: () => '/me',
            providesTags: ['userAPI'],
        }),
        removeUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['userAPI'],
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
