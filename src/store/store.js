import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSliceAPI";
import { userApi } from "@/features/auth/userSliceAPI";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});
