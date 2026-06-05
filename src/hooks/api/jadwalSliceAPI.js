import { createApi } from '@reduxjs/toolkit/query/react';
import { jadwalBaseQuery } from '../lib/baseQuery';

export const jadwalAPI = createApi({
    reducerPath: 'jadwalAPI',
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: jadwalBaseQuery,
    tagTypes: ['jadwalAPI'],
    endpoints: (builder) => ({
        createJadwal: builder.mutation({
            query: (data) => ({
                url: '/create',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['jadwalAPI'],
        }),
        modifyJadwal: builder.mutation({
            query: ({id, ...data}) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['jadwalAPI'],
        }),
        seeAllJadwalByKelasAndTahunAjaran: builder.query({
            query: ({ kelasId }) => ({
                url: `/?kelasId=${kelasId}`,
            }),
            providesTags: ['jadwalAPI'],
        }),
        removeJadwal: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['jadwalAPI'],
        })
    }),
});

export const { useCreateJadwalMutation, useSeeAllJadwalByKelasAndTahunAjaranQuery, useRemoveJadwalMutation, useModifyJadwalMutation } = jadwalAPI;
