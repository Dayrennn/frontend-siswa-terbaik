import { createApi } from '@reduxjs/toolkit/query/react';
import { kelasindukBaseQuery } from '../lib/baseQuery';

export const kelasIndukAPI = createApi({
    reducerPath: 'kelasIndukAPI',
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: kelasindukBaseQuery,
    tagTypes: ['kelasIndukAPI'],
    endpoints: (builder) => ({
        seeAllKelasInduk: builder.query({
            query: () => '/',
            providesTags: ['kelasIndukAPI'],
        }),
    }),
});

export const { useSeeAllKelasIndukQuery } = kelasIndukAPI;
