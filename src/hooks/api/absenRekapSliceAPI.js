import { createApi } from '@reduxjs/toolkit/query/react';
import { absenRekapBaseQuery } from '../lib/baseQuery';

export const absenRekapAPI = createApi({
    reducerPath: 'absenRekapAPI',
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: absenRekapBaseQuery,
    tagTypes: ['absenRekapAPI'],
    endpoints: (builder) => ({
        simpanAbsen: builder.mutation({
            query: ({ siswaId, pelajaranId, data }) => ({
                url: `/simpan/${siswaId}/${pelajaranId}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['absenRekapAPI'],
        }),
    }),
});

export const { useSimpanAbsenMutation } = absenRekapAPI;
