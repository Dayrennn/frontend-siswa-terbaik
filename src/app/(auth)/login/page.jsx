'use client';

import FormLogin from '../../conponents/form/login/page';

export default function Login() {
    return (
        <div className="min-h-screen flex">

            {/* Left Side */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-indigo-700">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />

                <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                    <div className="mb-6">
                        <img
                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white"
                            alt="Logo"
                            className="h-16"
                        />
                    </div>

                    <h1 className="text-5xl font-bold leading-tight">
                        Sistem Pemilihan
                        <br />
                        Siswa Terbaik
                    </h1>

                    <p className="mt-6 text-lg text-indigo-100 max-w-md">
                        Platform untuk membantu proses seleksi siswa
                        terbaik secara objektif, transparan, dan cepat.
                    </p>

                    <div className="mt-12 flex gap-6">
                        <div>
                            <h3 className="text-3xl font-bold">100%</h3>
                            <p className="text-indigo-200 text-sm">
                                Transparan
                            </p>
                        </div>

                        <div>
                            <h3 className="text-3xl font-bold">24/7</h3>
                            <p className="text-indigo-200 text-sm">
                                Akses Sistem
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-10">
                <div className="w-full max-w-md">

                    <div className="lg:hidden flex justify-center mb-8">
                        <img
                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                            alt="Logo"
                            className="h-14"
                        />
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900">
                            Selamat Datang 👋
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Masukkan akun Anda untuk melanjutkan.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
                        <FormLogin />
                    </div>

                    <p className="mt-6 text-center text-sm text-slate-400">
                        © 2026 Sistem Pendukung Keputusan
                    </p>

                </div>
            </div>

        </div>
    );
}