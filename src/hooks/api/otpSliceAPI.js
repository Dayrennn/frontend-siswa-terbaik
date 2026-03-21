import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../lib/baseQuery";

export const otpAPI = createApi({
  reducerPath: "otpAPI",
  refetchOnFocus: true,
  baseQuery,
  tagTypes: ["otpAPI"],
  endpoints: (builder) => ({
    sendRegisterOtp: builder.mutation({
      query: (data) => ({
        url: "/otp/register",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSendRegisterOtpMutation } = otpAPI;
