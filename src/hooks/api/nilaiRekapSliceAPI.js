import { createApi } from '@reduxjs/toolkit/query/react';
import { nilaiBaseQuery } from '../lib/baseQuery';

export const nilaiRekapAPI = createApi({
    reducerPath: 'nilaiRekapAPI',
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: nilaiBaseQuery,
    tagTypes: ['nilaiRekapAPI'],
    endpoints: (builder) => ({
        simpanNilaiRekap: builder.mutation({
            query: ({ siswaId, pelajaranId, data }) => ({
                url: `/simpan/${siswaId}/nilai-rekap/${pelajaranId}`,
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useSimpanNilaiRekapMutation } = nilaiRekapAPI;
