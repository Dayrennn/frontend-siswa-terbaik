import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/src/hooks/api/authSliceAPI";
import { userAPI } from "@/src/hooks/api/userSliceAPI";
import { otpAPI } from "@/src/hooks/api/otpSliceAPI";
import { siswaAPI } from "@/src/hooks/api/siswaSliceAPI";
import { kriteriaAPI } from "@/src/hooks/api/kriteriaSliceAPI";
import { pelajaranAPI } from "@/src/hooks/api/pelajaranSliceAPI";
import { kehadiranAPI } from "@/src/hooks/api/kehadiranSliceAPI";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [otpAPI.reducerPath]: otpAPI.reducer,
    [siswaAPI.reducerPath]: siswaAPI.reducer,
    [kriteriaAPI.reducerPath]: kriteriaAPI.reducer,
    [pelajaranAPI.reducerPath]: pelajaranAPI.reducer,
    [kehadiranAPI.reducerPath]: kehadiranAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userAPI.middleware)
      .concat(otpAPI.middleware)
      .concat(siswaAPI.middleware)
      .concat(kriteriaAPI.middleware)
      .concat(pelajaranAPI.middleware)
      .concat(kehadiranAPI.middleware),
});
