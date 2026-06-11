import { createApi } from '@reduxjs/toolkit/query/react';
import { poinMinusBaseQuery } from '../lib/baseQuery';

export const poinMinusAPI = createApi({
    reducerPath: 'poinMinusAPI',
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: poinMinusBaseQuery,
    tagTypes: ['poinMinusAPI'],
    endpoints: (builder) => ({
        createPoinMinus: builder.mutation({
            query: (data) => ({
                url: "/create",
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['poinMinusAPI'],
        }),
    }),
});

export const { useCreatePoinMinusMutation } = poinMinusAPI;
