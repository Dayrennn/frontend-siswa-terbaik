import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../api/authSliceAPI";
import { userAPI } from "../api/userSliceAPI";
import { otpAPI } from "../api/otpSliceAPI";
import { siswaAPI } from "../api/siswaSliceAPI";
import { kriteriaAPI } from "../api/kriteriaSliceAPI";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [otpAPI.reducerPath]: otpAPI.reducer,
    [siswaAPI.reducerPath]: siswaAPI.reducer,
    [kriteriaAPI.reducerPath]: kriteriaAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userAPI.middleware)
      .concat(otpAPI.middleware)
      .concat(siswaAPI.middleware).concat[kriteriaAPI.middleware],
});
