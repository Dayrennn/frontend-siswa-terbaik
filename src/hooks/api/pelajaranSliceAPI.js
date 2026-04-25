import { createApi } from '@reduxjs/toolkit/query/react';
import { pelajaranBaseQuery } from '../lib/baseQuery';

export const pelajaranAPI = createApi({
    reducerPath: 'pelajaranAPI',
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: pelajaranBaseQuery,
    tagTypes: ['pelajaranAPI'],
    endpoints: (builder) => ({
        createPelajaran: builder.mutation({
            query: (data) => ({
                url: '/create',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['pelajaranAPI'],
        }),
        modifyPelajaran: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['pelajaranAPI'],
        }),
        seeAllPelajaran: builder.query({
            query: () => '/',
            providesTags: ['pelajaranAPI'],
        }),
        getPelajaranById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ['pelajaranAPI'],
        }),
        removePelajaran: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['pelajaranAPI'],
        }),
    }),
});

export const {
    useCreatePelajaranMutation,
    useModifyPelajaranMutation,
    useSeeAllPelajaranQuery,
    useGetPelajaranByIdQuery,
    useRemovePelajaranMutation,
} = pelajaranAPI;
