import { createApi } from '@reduxjs/toolkit/query/react';
import { kehadiranBaseQuery } from '../lib/baseQuery';

export const kehadiranAPI = createApi({
    reducerPath: 'kehadiranAPI',
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: kehadiranBaseQuery,
    tagTypes: ['kehadiranAPI'],
    endpoints: (builder) => ({
        createKehadiran: builder.mutation({
            query: ({ tahunAjaranId, pertemuanId, ...data }) => ({
                url: `/create/${tahunAjaranId}/${pertemuanId}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['kehadiranAPI'],
        }),
        modifyKehadiran: builder.mutation({
            query: ({ tahunAjaranId, pertemuanId, kelasId, siswaId, statusKehadiran }) => ({
                url: `/update/${tahunAjaranId}/${kelasId}/absen/${pertemuanId}`,
                method: 'PUT',
                body: { siswaId, statusKehadiran },
            }),
            invalidatesTags: ['kehadiranAPI'],
        }),
        seeAllKehadiran: builder.query({
            query: () => '/',
            providesTags: ['kehadiranAPI'],
        }),
        getKehadiranById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ['kehadiranAPI'],
        }),
        getAbsenByPertemuan: builder.query({
            query: ({ tahunAjaranId, pertemuanId, kelasId }) => `/${tahunAjaranId}/${kelasId}/absen/${pertemuanId}`,
            providesTags: ['kehadiranAPI'],
        }),
        getKehadiranByKelas: builder.query({
            query: ({ kelasId, tahunAjaranId, tanggal }) =>
                `/kelas?kelasId=${kelasId}&tahunAjaranId=${tahunAjaranId}&tanggal=${tanggal}`,
            providesTags: ['kehadiranAPI'],
        }),
        simpanKehadiran: builder.mutation({
            query: (data) => ({
                url: '/simpan',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['kehadiranAPI'],
        }),
    }),
});

export const {
    useCreateKehadiranMutation,
    useModifyKehadiranMutation,
    useSeeAllKehadiranQuery,
    useGetKehadiranByIdQuery,
    useGetAbsenByPertemuanQuery,
    useGetKehadiranByKelasQuery,
    useSimpanKehadiranMutation,
} = kehadiranAPI;
