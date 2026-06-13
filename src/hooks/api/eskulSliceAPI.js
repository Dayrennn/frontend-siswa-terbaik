import { createApi } from '@reduxjs/toolkit/query/react';
import { eskulBaseQuery } from '../lib/baseQuery';

export const eskulAPI = createApi({
    reducerPath: 'eskulAPI',
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: eskulBaseQuery,
    tagTypes: ['eskulAPI'],
    endpoints: (builder) => ({
        createEskul: builder.mutation({
            query: (data) => ({
                url: '/create',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['eskulAPI'],
        }),
        seeAllEskul: builder.query({
            query: () => '/',
            providesTags: ['eskulAPI'],
        }),
        modifyEskul: builder.mutation({
            query: ({ id, data }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['eskulAPI'],
        }),
        removeEskul: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['eskulAPI'],
        }),
    }),
});

export const { useCreateEskulMutation, useSeeAllEskulQuery, useModifyEskulMutation, useRemoveEskulMutation } = eskulAPI;
