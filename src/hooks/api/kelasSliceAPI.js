import { createApi } from '@reduxjs/toolkit/query/react';
import { kelasBaseQuery } from '../lib/baseQuery';

export const kelasAPI = createApi({
    reducerPath: 'kelasAPI',
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: kelasBaseQuery,
    tagTypes: ['kelasAPI'],
    endpoints: (builder) => ({
        createKelas: builder.mutation({
            query: (data) => ({
                url: '/create',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['kelasAPI'],
        }),
        modifyKelas: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['kelasAPI'],
        }),
        getAllKelas: builder.query({
            query: () => `/`,
            providesTags: ['kelasAPI'],
        }),
        getKelasById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ['kelasAPI'],
        }),
        removeKelas: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['kelasAPI'],
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
