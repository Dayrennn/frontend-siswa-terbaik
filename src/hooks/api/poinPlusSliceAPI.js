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
                url: '/create',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['poinPlusAPI'],
        }),
        editPoinPlus: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['poinPlusAPI'],
        }),
        removePoinPlus: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['poinPlusAPI'],
        }),
    }),
});

export const { useCreatePoinPlusMutation, useEditPoinPlusMutation, useRemovePoinPlusMutation } = poinPlusAPI;
