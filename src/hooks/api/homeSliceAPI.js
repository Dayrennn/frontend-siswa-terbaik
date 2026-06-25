import { createApi } from '@reduxjs/toolkit/query/react';
import { homeBaseQuery } from '../lib/baseQuery';

export const homeAPI = createApi({
    reducerPath: 'homeAPI',
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: homeBaseQuery,
    tagTypes: ['homeAPI'],
    endpoints: (builder) => ({
        seeAllHomeData: builder.query({
            query: () => '/',
            providesTags: ['homeAPI'],
        }),
    }),
});

export const { useSeeAllHomeDataQuery } = homeAPI;
