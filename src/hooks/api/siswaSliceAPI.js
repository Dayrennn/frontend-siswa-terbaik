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
            query: ({ page = 1, limit = 10, search = '' } = {}) =>
                `?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
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
            query: ({ page = 1, limit = 10, search = '' } = {}) =>
                `/hafalan?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
            providesTags: ['siswaAPI'],
        }),
        seeRankingKelas: builder.query({
            query: ({ tahunAjaranId, kelasId }) => ({
                url: '/ranking/kelas',
                params: { tahunAjaranId, kelasId },
            }),
            providesTags: ['siswaAPI'],
        }),
        seeRankingAngkatan: builder.query({
            query: ({ tahunAjaranId, kelasIndukId, limit = 10 }) => ({
                url: '/ranking/angkatan',
                params: { tahunAjaranId, kelasIndukId, limit },
            }),
            providesTags: ['siswaAPI'],
        }),
        getOneSiswaHafalan: builder.query({
            query: (id) => `/hafalan/${id}`,
            providesTags: ['siswaAPI'],
        }),
        seeOneSiswaAbsen: builder.query({
            query: ({ tahunAjaranId, siswaId, kelasId }) => `/${tahunAjaranId}/${kelasId}/${siswaId}/absen`,
            providesTags: ['siswaAPI'],
        }),
        seeOneNilaiSiswa: builder.query({
            query: ({ tahunAjaranId, siswaId, kelasId }) => `/${tahunAjaranId}/${kelasId}/${siswaId}/nilai`,
            providesTags: ['siswaAPI'],
        }),
        seeOneSiswaHafalan: builder.query({
            query: ({ siswaId, tahunAjaranId, kelasId }) => `/${tahunAjaranId}/${kelasId}/${siswaId}/hafalan`,
            providesTags: ['siswaAPI']
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
    useGetOneSiswaHafalanQuery,
    useSeeOneSiswaAbsenQuery,
    useSeeOneNilaiSiswaQuery,
    useSeeOneSiswaHafalanQuery
} = siswaAPI;
