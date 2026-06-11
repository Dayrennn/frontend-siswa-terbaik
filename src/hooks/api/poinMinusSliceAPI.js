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
                url: '/create',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['poinMinusAPI'],
        }),
        editPoinMinus: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['poinMinusAPI'],
        }),
        removePoinMinus: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['poinMinusAPI'],
        }),
    }),
});

export const { useCreatePoinMinusMutation, useEditPoinMinusMutation, useRemovePoinMinusMutation } = poinMinusAPI;
