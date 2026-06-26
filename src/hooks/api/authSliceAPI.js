import { createSlice } from '@reduxjs/toolkit';

// kenapa ada ini?untuk menyimpan data di Redux state setelah login berhasil.
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    },
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', action.payload.token); 
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token'); 
            }
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;
