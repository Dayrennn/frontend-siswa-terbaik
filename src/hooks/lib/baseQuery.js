import BACKEND_URL from './backendUrl';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const prepareHeaders = (headers, { getState }) => {
    const token = getState().auth.token || localStorage.getItem('token');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`); // ✅ kirim token di header
    }
    return headers;
};

export const baseQuery = fetchBaseQuery({
    baseUrl: BACKEND_URL,
    prepareHeaders,
});

export const kehadiranBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/kehadiran`,
    prepareHeaders,
});

export const kelasBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/kelas`,
    prepareHeaders,
});

export const kriteriaBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/kriteria`,
    prepareHeaders,
});

export const otpBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/otp`,
    prepareHeaders,
});

export const pelajaranBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/pelajaran`,
    prepareHeaders,
});

export const pertemuanBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/pertemuan`,
    prepareHeaders,
});

export const siswaBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/siswa`,
    prepareHeaders,
});

export const tahunAjaranBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/tahun-ajaran`,
    prepareHeaders,
});

export const userBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/auth`,
    prepareHeaders,
});

export const jadwalBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/jadwal`,
    prepareHeaders,
});

export const poinPlusBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/poin-plus`,
    prepareHeaders,
});

export const poinMinusBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/poin-minus`,
    prepareHeaders,
});

export const eskulBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/eskul`,
    prepareHeaders,
});

export const nilaiEskulBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/nilai-eskul`,
    prepareHeaders,
});

export const absenRekapBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/absen`,
    prepareHeaders,
});

export const nilaiBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/nilai`,
    prepareHeaders,
});

export const hafalanBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/hafalan`,
    prepareHeaders,
});

export const homeBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/home`,
    prepareHeaders,
});
