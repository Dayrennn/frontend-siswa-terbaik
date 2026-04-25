import { createApi } from '@reduxjs/toolkit/query/react';
import { otpBaseQuery } from '../lib/baseQuery';

export const otpAPI = createApi({
    reducerPath: 'otpAPI',
    refetchOnFocus: true,
    baseQuery: otpBaseQuery,
    tagTypes: ['otpAPI'],
    endpoints: (builder) => ({
        sendRegisterOtp: builder.mutation({
            query: (data) => ({
                url: '/register',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useSendRegisterOtpMutation } = otpAPI;
