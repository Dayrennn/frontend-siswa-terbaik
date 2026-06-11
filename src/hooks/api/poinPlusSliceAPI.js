import { createApi } from '@reduxjs/toolkit/query/react';
import { poinPlusBaseQuery } from '../lib/baseQuery';

export const poinPlusAPI = createApi({
    reducerPath: 'poinPlusAPI',
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: poinPlusBaseQuery,
    tagTypes: ['poinPlusAPI'],
    endpoints: (builder) => ({
        createPoinPlus: builder.mutation({
            query: (data) => ({
                url: "/create",
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['poinPlusAPI'],
        }),
    }),
});

export const { useCreatePoinPlusMutation } = poinPlusAPI;
