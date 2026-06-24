import { createApi } from '@reduxjs/toolkit/query/react';
import { siswaBaseQuery } from '../lib/baseQuery';

export const siswaAPI = createApi({
    reducerPath: 'siswaAPI',
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: siswaBaseQuery,
    tagTypes: ['siswaAPI', 'kehadiranAPI'],
    endpoints: (builder) => ({
        createSiswa: builder.mutation({
            query: (data) => ({
                url: '/create',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['siswaAPI', 'kehadiranAPI'],
        }),
        modifySiswa: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['siswaAPI'],
        }),
        seeAllSiswa: builder.query({
            query: () => '/',
            providesTags: ['siswaAPI'],
        }),
        getSiswaById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ['siswaAPI'],
        }),
        removeSiswa: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['siswaAPI', 'kehadiranAPI'],
        }),
        seeAllSiswaByTahunAjaran: builder.query({
            query: (tahunAjaranId) => `/tahun-ajaran/${tahunAjaranId}`,
            providesTags: ['siswaAPI'],
        }),
        seeAllSiswaByTahunAjaranAndKelas: builder.query({
            query: ({ tahunAjaranId, kelasId }) => `/tahun-ajaran/${tahunAjaranId}/${kelasId}`,
            providesTags: ['siswaAPI'],
        }),
        seeAllSiswaByEskul: builder.query({
            query: ({ tahunAjaranId, eskulId }) => ({
                url: `/siswa-eskul/${eskulId}`,
                params: { tahunAjaranId },
            }),
            providesTags: ['siswaAPI'],
        }),
        seeAllSiswaByHafalan: builder.query({
            query: () => '/hafalan',
            providesTags: ['siswaAPI'],
        }),
        seeRankingKelas: builder.query({
            query: ({ tahunAjaranId, kelasId }) => `/ranking/kelas/${tahunAjaranId}/${kelasId}`,
            providesTags: ['siswaAPI'],
        }),
        seeRankingAngkatan: builder.query({
            query: (tahunAjaranId) => `/ranking/angkatan/${tahunAjaranId}`,
            providesTags: ['siswaAPI'],
        }),
    }),
});

export const {
    useCreateSiswaMutation,
    useModifySiswaMutation,
    useSeeAllSiswaQuery,
    useGetSiswaByIdQuery,
    useRemoveSiswaMutation,
    useSeeAllSiswaByTahunAjaranQuery,
    useSeeAllSiswaByTahunAjaranAndKelasQuery,
    useSeeAllSiswaByEskulQuery,
    useSeeAllSiswaByHafalanQuery,
    useSeeRankingKelasQuery,
    useSeeRankingAngkatanQuery,
} = siswaAPI;
