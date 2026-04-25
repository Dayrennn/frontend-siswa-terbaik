import { createApi } from '@reduxjs/toolkit/query/react';
import { tahunAjaranBaseQuery } from '../lib/baseQuery';

export const tahunAjaranAPI = createApi({
    reducerPath: 'tahunAjaranAPI',
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: tahunAjaranBaseQuery,
    tagTypes: ['tahunAjaranAPI'],
    endpoints: (builder) => ({
        createTahunAjaran: builder.mutation({
            query: (data) => ({
                url: '/create',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['tahunAjaranAPI'],
        }),
        modifyTahunAjaran: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['tahunAjaranAPI'],
        }),
        seeAllTahunAjaran: builder.query({
            query: () => '/',
            providesTags: ['tahunAjaranAPI'],
        }),
        getTahunAjaranById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ['tahunAjaranAPI'],
        }),
        removeTahunAjaran: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['tahunAjaranAPI'],
        }),
    }),
});

export const {
    useCreateTahunAjaranMutation,
    useModifyTahunAjaranMutation,
    useSeeAllTahunAjaranQuery,
    useGetTahunAjaranByIdQuery,
    useRemoveTahunAjaranMutation,
} = tahunAjaranAPI;
