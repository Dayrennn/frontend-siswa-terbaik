import { createApi } from '@reduxjs/toolkit/query/react';
import { nilaiEskulBaseQuery } from '../lib/baseQuery';

export const nilaiEskulAPI = createApi({
    reducerPath: 'nilaiEskulAPI',
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: nilaiEskulBaseQuery,
    tagTypes: ['nilaiEskulAPI'],
    endpoints: (builder) => ({
        inputNilaiEskul: builder.mutation({
            query: ({ siswaId, eskulId, data }) => ({
                url: `/simpan/${siswaId}/nilai-eskul/${eskulId}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['nilaiEskulAPI'],
        }),
    }),
});

export const { useInputNilaiEskulMutation } = nilaiEskulAPI;
