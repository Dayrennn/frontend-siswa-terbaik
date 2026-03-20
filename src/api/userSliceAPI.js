import BACKEND_URL from "../lib/backendUrl";

export const userAPI = createApi({
  reducerPath: "userAPI",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["userAPI"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "auth/register",
        method: "POST",
        body: data,
      }),
      invalidateTags: ["userAPI"],
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "auth/verify-otp",
        method: "POST",
        body: data,
      }),
      invalidateTags: ["userAPI"],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidateTags: ["userAPI"],
    }),
    update: builder.mutation({
      query: (id, ...data) => ({
        url: `auth/users/${id}`,
        method: "POST",
        body: data,
      }),
      invalidateTags: ["userAPI"],
    }),
    getUser: builder.query({
      query: () => ({
        url: "auth/users",
        method: "GET",
      }),
      invalidateTags: ["userAPI"],
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `auth/users/${id}`,
      }),
    }),
  }),
});
