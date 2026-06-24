import { createApi } from '@reduxjs/toolkit/query/react';
import { hafalanBaseQuery } from '../lib/baseQuery';

export const hafalanAPI = createApi({
    reducerPath: 'hafalanAPI',
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: hafalanBaseQuery,
    tagTypes: ['hafalanAPI'],
    endpoints: (builder) => ({
        simpanHafalan: builder.mutation({
            query: ({ siswaId, data }) => ({
                url: `/simpan/${siswaId}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['hafalanAPI'],
        }),
    }),
});

export const { useSimpanHafalanMutation } = hafalanAPI;
