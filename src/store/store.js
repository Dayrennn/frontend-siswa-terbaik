import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/src/hooks/api/authSliceAPI';
import { userAPI } from '@/src/hooks/api/userSliceAPI';
import { otpAPI } from '@/src/hooks/api/otpSliceAPI';
import { siswaAPI } from '@/src/hooks/api/siswaSliceAPI';
import { kriteriaAPI } from '@/src/hooks/api/kriteriaSliceAPI';
import { pelajaranAPI } from '@/src/hooks/api/pelajaranSliceAPI';
import { tahunAjaranAPI } from '@/src/hooks/api/tahunAjaranSliceAPI';
import { kelasAPI } from '@/src/hooks/api/kelasSliceAPI';
import { poinPlusAPI } from '../hooks/api/poinPlusSliceAPI';
import { poinMinusAPI } from '../hooks/api/poinMinusSliceAPI';
import { eskulAPI } from '../hooks/api/eskulSliceAPI';
import { nilaiEskulAPI } from '../hooks/api/nilaiEskulSliceAPI';
import { absenRekapAPI } from '../hooks/api/absenRekapSliceAPI';
import { nilaiRekapAPI } from '../hooks/api/nilaiRekapSliceAPI';
import { hafalanAPI } from '../hooks/api/hafalanSliceAPI';
import { homeAPI } from '../hooks/api/homeSliceAPI';
import { kelasIndukAPI } from '../hooks/api/kelasIndukSliceAPI';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [userAPI.reducerPath]: userAPI.reducer,
        [otpAPI.reducerPath]: otpAPI.reducer,
        [siswaAPI.reducerPath]: siswaAPI.reducer,
        [kriteriaAPI.reducerPath]: kriteriaAPI.reducer,
        [pelajaranAPI.reducerPath]: pelajaranAPI.reducer,
        [tahunAjaranAPI.reducerPath]: tahunAjaranAPI.reducer,
        [kelasAPI.reducerPath]: kelasAPI.reducer,
        [poinPlusAPI.reducerPath]: poinPlusAPI.reducer,
        [poinMinusAPI.reducerPath]: poinMinusAPI.reducer,
        [eskulAPI.reducerPath]: eskulAPI.reducer,
        [nilaiEskulAPI.reducerPath]: nilaiEskulAPI.reducer,
        [absenRekapAPI.reducerPath]: absenRekapAPI.reducer,
        [nilaiRekapAPI.reducerPath]: nilaiRekapAPI.reducer,
        [hafalanAPI.reducerPath]: hafalanAPI.reducer,
        [homeAPI.reducerPath]: homeAPI.reducer,
        [kelasIndukAPI.reducerPath]: kelasIndukAPI.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(userAPI.middleware)
            .concat(otpAPI.middleware)
            .concat(siswaAPI.middleware)
            .concat(kriteriaAPI.middleware)
            .concat(pelajaranAPI.middleware)
            .concat(tahunAjaranAPI.middleware)
            .concat(kelasAPI.middleware)
            .concat(poinPlusAPI.middleware)
            .concat(poinMinusAPI.middleware)
            .concat(eskulAPI.middleware)
            .concat(nilaiEskulAPI.middleware)
            .concat(absenRekapAPI.middleware)
            .concat(nilaiRekapAPI.middleware)
            .concat(hafalanAPI.middleware)
            .concat(homeAPI.middleware)
            .concat(kelasIndukAPI.middleware),
});
