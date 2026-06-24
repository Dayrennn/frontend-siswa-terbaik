'use client';

import { useState } from 'react';
import { useLoginMutation } from '../../../../hooks/api/userSliceAPI';
import { setCredentials } from '../../../../hooks/api/authSliceAPI';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function FormLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [login, { isLoading }] = useLoginMutation();

    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoginError('');

        try {
            const result = await login({
                email,
                password,
            }).unwrap();

            const user = result.data;

            dispatch(setCredentials({ user }));

            switch (user.role) {
                case 'Admin':
                    router.push('/dashboard/admin');
                    break;

                case 'Guru':
                    router.push('/dashboard/guru');
                    break;

                case 'WaliKelas':
                    router.push('/dashboard/wali-kelas');
                    break;

                case 'KepalaSekolah':
                    router.push('/dashboard/kepala-sekolah');
                    break;

                case 'WakilKepalaSekolah':
                    router.push('/dashboard/wakil-kepala-sekolah');
                    break;

                default:
                    router.push('/login');
            }
        } catch (err) {
            console.error(err);

            setLoginError(err?.data?.message || 'Email atau password yang Anda masukkan salah.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                </label>

                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    placeholder="Masukkan email"
                    className="
                        w-full
                        rounded-xl
                        border border-slate-300
                        bg-slate-50
                        px-4 py-3
                        text-slate-900
                        placeholder:text-slate-400
                        focus:border-indigo-500
                        focus:ring-4
                        focus:ring-indigo-100
                        focus:outline-none
                        transition
                    "
                />
            </div>

            {/* Password */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                        Password
                    </label>

                    <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700">
                        Forgot Password?
                    </button>
                </div>

                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    placeholder="Masukkan password"
                    className="
                        w-full
                        rounded-xl
                        border border-slate-300
                        bg-slate-50
                        px-4 py-3
                        text-slate-900
                        placeholder:text-slate-400
                        focus:border-indigo-500
                        focus:ring-4
                        focus:ring-indigo-100
                        focus:outline-none
                        transition
                    "
                />
            </div>

            {/* Error Message */}
            {loginError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-600 font-medium">{loginError}</p>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="
                    w-full
                    rounded-xl
                    bg-indigo-600
                    px-4 py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-indigo-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    shadow-lg
                    shadow-indigo-500/20
                "
            >
                {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
        </form>
    );
}
