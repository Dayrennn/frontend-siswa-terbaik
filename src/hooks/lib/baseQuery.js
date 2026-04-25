import BACKEND_URL from "./backendUrl";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
  baseUrl: BACKEND_URL,
  credentials: "include",
});

export const kehadiranBaseQuery = fetchBaseQuery({
  baseUrl: `${BACKEND_URL}/kehadiran`,
  credentials: "include",
});

export const kelasBaseQuery = fetchBaseQuery({
  baseUrl: `${BACKEND_URL}/kelas`,
  credentials: "include",
});

export const kriteriaBaseQuery = fetchBaseQuery({
  baseUrl: `${BACKEND_URL}/kriteria`,
  credentials: "include",
});

export const otpBaseQuery = fetchBaseQuery({
  baseUrl: `${BACKEND_URL}/otp`,
  credentials: "include",
});

export const pelajaranBaseQuery = fetchBaseQuery({
  baseUrl: `${BACKEND_URL}/pelajaran`,
  credentials: "include",
});

export const pertemuanBaseQuery = fetchBaseQuery({
  baseUrl: `${BACKEND_URL}/pertemuan`,
  credentials: "include",
});

export const siswaBaseQuery = fetchBaseQuery({
  baseUrl: `${BACKEND_URL}/siswa`,
  credentials: "include",
});

export const tahunAjaranBaseQuery = fetchBaseQuery({
  baseUrl: `${BACKEND_URL}/tahun-ajaran`,
  credentials: "include",
});

export const userBaseQuery = fetchBaseQuery({
  baseUrl: `${BACKEND_URL}/auth`,
  credentials: "include",
});
