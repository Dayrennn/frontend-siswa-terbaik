import { createApi } from '@reduxjs/toolkit/query/react';
import { pertemuanBaseQuery } from '../lib/baseQuery';

export const pertemuanAPI = createApi({
    reducerPath: 'pertemuanAPI',
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: pertemuanBaseQuery,
    endpoints: (builder) => ({
        createPertemuan: builder.mutation({
            query: (data, kelasId) => ({
                url: `/create/${kelasId}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['pertemuanAPI'],
        }),
        modifyPertemuan: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['pertemuanAPI'],
        }),
        seeAllPertemuan: builder.query({
            query: () => '/',
            providesTags: ['pertemuanAPI'],
        }),
        seeAllPertemuanByTahunAndKelas: builder.query({
            query: ({ tahunAjaranId, kelasId }) => `/${tahunAjaranId}/${kelasId}`,
            providesTags: ['pertemuanAPI'],
        }),
        seeOnePertemuanById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ['pertemuanAPI'],
        }),
        removePertemuan: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['pertemuanAPI'],
        }),
    }),
});

export const {
    useCreatePertemuanMutation,
    useModifyPertemuanMutation,
    useSeeAllPertemuanQuery,
    useSeeAllPertemuanByTahunAndKelasQuery,
    useSeeOnePertemuanByIdQuery,
    useRemovePertemuanMutation,
} = pertemuanAPI;
