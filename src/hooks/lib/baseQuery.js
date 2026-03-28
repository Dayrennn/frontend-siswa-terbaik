import BACKEND_URL from "./backendUrl";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
  baseUrl: BACKEND_URL,
  credentials: "include",
});
