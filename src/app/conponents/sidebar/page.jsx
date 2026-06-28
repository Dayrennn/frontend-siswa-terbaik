'use client';

import {
    FaHome,
    FaUsers,
    FaClipboardList,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaGraduationCap,
    FaChevronDown,
} from 'react-icons/fa';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction, selectUser } from '../../../hooks/api/authSliceAPI';
import { useLogoutMutation } from '../../../hooks/api/userSliceAPI';
import { useState, useEffect } from 'react';
import LogoutModal from '../modal/logoutModal';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState([]);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector(selectUser); // ngambil dari redux
    const [logoutApi, { isLoading: isLogoutLoading }] = useLogoutMutation();

    const isAdmin = user?.role === 'Admin';
    const isGuru = user?.role === 'Guru';
    const isWaliKelas = user?.role === 'WaliKelas';
    const isKepalaSekolah = user?.role === 'KepalaSekolah';
    const isWakilKepalaSekolah = user?.role === 'WakilKepalaSekolah';
    const isAll = isAdmin || isGuru || isWaliKelas || isKepalaSekolah || isWakilKepalaSekolah;

    const dashboardLink =
        isAdmin ? '/dashboard/admin' :
        isGuru ? '/dashboard/guru' :
        isWaliKelas ? '/dashboard/wali-kelas' :
        isKepalaSekolah ? '/dashboard/kepala-sekolah' :
        isWakilKepalaSekolah ? '/dashboard/wakil-kepala-sekolah' : '/';

    const toggleMenu = (menu) => {
        setOpenMenus((prev) => (prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]));
    };

    const isMenuOpen = (name) => openMenus.includes(name);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
        } catch (error) {
            console.error('Logout gagal', error);
        } finally {
            dispatch(logoutAction());
            router.push('/login');   
        }
    };

    return (
        <>
            {showLogoutModal && (
                <LogoutModal
                    onConfirm={handleLogout}
                    onCancel={() => setShowLogoutModal(false)}
                    isLoading={isLogoutLoading}
                />
            )}

            <button
                className="fixed top-4 left-4 z-50 bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg md:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>

            <aside
                className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300
                    w-[80%] sm:w-64 md:w-60 flex flex-col
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
                style={{ background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%)' }}
            >
                {/* LOGO */}
                <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10 shrink-0">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <FaGraduationCap className="text-white text-sm" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm">Sistem Siswa</p>
                        <p className="text-indigo-300 text-xs">Admin Panel</p>
                    </div>
                </div>

                {/* MENU */}
                <nav className="flex-1 overflow-y-auto p-3 mt-2 space-y-1
                    [&::-webkit-scrollbar]:w-1.5
                    [&::-webkit-scrollbar-thumb]:bg-indigo-500
                    [&::-webkit-scrollbar-thumb]:rounded-full">

                    <p className="text-indigo-400 text-xs font-semibold px-3 mb-2 uppercase tracking-widest">Menu</p>

                    {/* DASHBOARD */}
                    {isAll && (
                        <Link
                            href={dashboardLink}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                                ${pathname === dashboardLink ? 'bg-white/20 text-white' : 'text-indigo-200 hover:bg-white/10 hover:text-white'}`}
                        >
                            <FaHome />
                            Dashboard
                        </Link>
                    )}

                    {/* MENU SISWA */}
                    {isAll && (
                        <div>
                            <button
                                onClick={() => toggleMenu('Menu Siswa')}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium
                                    ${pathname.startsWith('/page/data-pelajaran') || pathname.startsWith('/page/data-siswa') || pathname.startsWith('/page/data-kelas') || pathname.startsWith('/page/tahun-ajaran') || pathname.startsWith('/page/data-pelanggaran') || pathname.startsWith('/page/data-eskul') || pathname.startsWith('/page/data-absen') || pathname.startsWith('/page/data-hafalan')
                                        ? 'bg-white/20 text-white' : 'text-indigo-200 hover:bg-white/10 hover:text-white'}`}
                            >
                                <div className="flex items-center gap-3"><FaUsers />Menu Siswa</div>
                                <FaChevronDown className={`transition-transform duration-300
                                    ${isMenuOpen('Menu Siswa') || pathname.startsWith('/page/data-pelajaran') || pathname.startsWith('/page/data-siswa') || pathname.startsWith('/page/data-kelas') || pathname.startsWith('/page/tahun-ajaran') || pathname.startsWith('/page/data-pelanggaran') || pathname.startsWith('/page/data-eskul') || pathname.startsWith('/page/data-absen') || pathname.startsWith('/page/data-hafalan') ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <div className={`ml-6 overflow-hidden transition-all duration-300
                                ${isMenuOpen('Menu Siswa') || pathname.startsWith('/page/data-pelajaran') || pathname.startsWith('/page/data-siswa') || pathname.startsWith('/page/data-kelas') || pathname.startsWith('/page/tahun-ajaran') || pathname.startsWith('/page/data-pelanggaran') || pathname.startsWith('/page/data-eskul') || pathname.startsWith('/page/data-absen') || pathname.startsWith('/page/data-hafalan') ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                <div className="space-y-1">

                                    {(isAdmin || isGuru || isWaliKelas || isWakilKepalaSekolah || isKepalaSekolah) && (
                                        <Link href="/page/data-pelajaran" onClick={() => setIsOpen(false)}
                                            className={`block px-3 py-2 rounded-lg text-sm
                                                ${pathname.startsWith('/page/data-pelajaran') ? 'bg-white/20 text-white' : 'text-indigo-300 hover:bg-white/10 hover:text-white'}`}>
                                            Data Pelajaran
                                        </Link>
                                    )}

                                    {(isAdmin || isGuru || isWaliKelas || isWakilKepalaSekolah || isKepalaSekolah) && (
                                        <Link href="/page/data-siswa" onClick={() => setIsOpen(false)}
                                            className={`block px-3 py-2 rounded-lg text-sm
                                                ${pathname.startsWith('/page/data-siswa') ? 'bg-white/20 text-white' : 'text-indigo-300 hover:bg-white/10 hover:text-white'}`}>
                                            Data Siswa
                                        </Link>
                                    )}

                                    {(isAdmin || isGuru || isWaliKelas || isWakilKepalaSekolah || isKepalaSekolah) && (
                                        <Link href="/page/data-kelas" onClick={() => setIsOpen(false)}
                                            className={`block px-3 py-2 rounded-lg text-sm
                                                ${pathname.startsWith('/page/data-kelas') ? 'bg-white/20 text-white' : 'text-indigo-300 hover:bg-white/10 hover:text-white'}`}>
                                            Data Kelas
                                        </Link>
                                    )}

                                    {(isAdmin || isWakilKepalaSekolah || isKepalaSekolah) && (
                                        <Link href="/page/tahun-ajaran" onClick={() => setIsOpen(false)}
                                            className={`block px-3 py-2 rounded-lg text-sm
                                                ${pathname.startsWith('/page/tahun-ajaran') ? 'bg-white/20 text-white' : 'text-indigo-300 hover:bg-white/10 hover:text-white'}`}>
                                            Data Tahun Ajaran
                                        </Link>
                                    )}

                                    {(isAdmin || isWaliKelas || isWakilKepalaSekolah || isKepalaSekolah) && (
                                        <Link href="/page/data-pelanggaran" onClick={() => setIsOpen(false)}
                                            className={`block px-3 py-2 rounded-lg text-sm
                                                ${pathname.startsWith('/page/data-pelanggaran') ? 'bg-white/20 text-white' : 'text-indigo-300 hover:bg-white/10 hover:text-white'}`}>
                                            Data Pelanggaran
                                        </Link>
                                    )}

                                    {(isAdmin || isGuru || isWaliKelas || isWakilKepalaSekolah || isKepalaSekolah) && (
                                        <Link href="/page/data-eskul" onClick={() => setIsOpen(false)}
                                            className={`block px-3 py-2 rounded-lg text-sm
                                                ${pathname.startsWith('/page/data-eskul') ? 'bg-white/20 text-white' : 'text-indigo-300 hover:bg-white/10 hover:text-white'}`}>
                                            Data Eskul
                                        </Link>
                                    )}

                                    {(isAdmin || isGuru || isWaliKelas || isWakilKepalaSekolah) && (
                                        <Link href="/page/data-absen" onClick={() => setIsOpen(false)}
                                            className={`block px-3 py-2 rounded-lg text-sm
                                                ${pathname.startsWith('/page/data-absen') ? 'bg-white/20 text-white' : 'text-indigo-300 hover:bg-white/10 hover:text-white'}`}>
                                            Data Absen
                                        </Link>
                                    )}

                                    {(isAdmin || isGuru || isWaliKelas || isWakilKepalaSekolah || isKepalaSekolah) && (
                                        <Link href="/page/data-hafalan" onClick={() => setIsOpen(false)}
                                            className={`block px-3 py-2 rounded-lg text-sm
                                                ${pathname.startsWith('/page/data-hafalan') ? 'bg-white/20 text-white' : 'text-indigo-300 hover:bg-white/10 hover:text-white'}`}>
                                            Data Hafalan
                                        </Link>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}

                    {/* PENILAIAN */}
                    {(isAdmin || isWaliKelas || isWakilKepalaSekolah || isGuru || isKepalaSekolah) && (
                        <div>
                            <button
                                onClick={() => toggleMenu('Penilaian')}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium
                                    ${pathname.startsWith('/page/data-kriteria') || pathname.startsWith('/page/data-nilai') || pathname.startsWith('/page/data-ranking') || pathname.startsWith('/page/hitung-nilai')
                                        ? 'bg-white/20 text-white' : 'text-indigo-200 hover:bg-white/10 hover:text-white'}`}
                            >
                                <div className="flex items-center gap-3"><FaClipboardList />Penilaian</div>
                                <FaChevronDown className={`transition-transform duration-300
                                    ${isMenuOpen('Penilaian') || pathname.startsWith('/page/data-kriteria') || pathname.startsWith('/page/data-nilai') || pathname.startsWith('/page/data-ranking') || pathname.startsWith('/page/hitung-nilai') ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <div className={`ml-6 overflow-hidden transition-all duration-300
                                ${isMenuOpen('Penilaian') || pathname.startsWith('/page/data-kriteria') || pathname.startsWith('/page/data-nilai') || pathname.startsWith('/page/data-ranking') || pathname.startsWith('/page/hitung-nilai') ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                <div className="space-y-1">

                                    {(isAdmin || isWakilKepalaSekolah || isGuru || isWaliKelas) && (
                                        <Link href="/page/data-kriteria" onClick={() => setIsOpen(false)}
                                            className={`block px-3 py-2 rounded-lg text-sm
                                                ${pathname.startsWith('/page/data-kriteria') ? 'bg-white/20 text-white' : 'text-indigo-300 hover:bg-white/10 hover:text-white'}`}>
                                            Data Kriteria
                                        </Link>
                                    )}

                                    {(isAdmin || isWaliKelas || isWakilKepalaSekolah || isGuru) && (
                                        <Link href="/page/data-nilai" onClick={() => setIsOpen(false)}
                                            className={`block px-3 py-2 rounded-lg text-sm
                                                ${pathname.startsWith('/page/data-nilai') ? 'bg-white/20 text-white' : 'text-indigo-300 hover:bg-white/10 hover:text-white'}`}>
                                            Data Nilai
                                        </Link>
                                    )}

                                    {(isAdmin || isWakilKepalaSekolah || isGuru || isKepalaSekolah) && (
                                        <Link href="/page/data-ranking" onClick={() => setIsOpen(false)}
                                            className={`block px-3 py-2 rounded-lg text-sm
                                                ${pathname.startsWith('/page/data-ranking') ? 'bg-white/20 text-white' : 'text-indigo-300 hover:bg-white/10 hover:text-white'}`}>
                                            Ranking & SMART
                                        </Link>
                                    )}

                                    {isAdmin && (
                                        <Link href="/page/hitung-nilai" onClick={() => setIsOpen(false)}
                                            className={`block px-3 py-2 rounded-lg text-sm
                                                ${pathname.startsWith('/page/hitung-nilai') ? 'bg-white/20 text-white' : 'text-indigo-300 hover:bg-white/10 hover:text-white'}`}>
                                            Hitung Nilai
                                        </Link>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}

                    {/* MASTER DATA - Admin only */}
                    {isAdmin && (
                        <div>
                            <button
                                onClick={() => toggleMenu('Master Data')}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium
                                    ${pathname.startsWith('/page/data-user') ? 'bg-white/20 text-white' : 'text-indigo-200 hover:bg-white/10 hover:text-white'}`}
                            >
                                <div className="flex items-center gap-3"><FaUsers />Master Data</div>
                                <FaChevronDown className={`transition-transform duration-300
                                    ${isMenuOpen('Master Data') || pathname.startsWith('/page/data-user') ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <div className={`ml-6 overflow-hidden transition-all duration-300
                                ${isMenuOpen('Master Data') || pathname.startsWith('/page/data-user') ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                <div className="space-y-1">

                                    {isAdmin && (
                                        <Link href="/page/data-user" onClick={() => setIsOpen(false)}
                                            className={`block px-3 py-2 rounded-lg text-sm
                                                ${pathname.startsWith('/page/data-user') ? 'bg-white/20 text-white' : 'text-indigo-300 hover:bg-white/10 hover:text-white'}`}>
                                            Data User
                                        </Link>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}

                </nav>

                {/* FOOTER */}
                <div className="p-3 border-t border-white/10 shrink-0">
                    <div className="bg-white/10 rounded-xl px-3 py-2.5 mb-2 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-400/40 flex items-center justify-center">
                            <FaUsers className="text-white text-xs" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-white text-sm truncate">{user?.username ?? 'Loading...'}</p>
                            <p className="text-indigo-300 text-xs truncate">{user?.email ?? ''}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm w-full
                            text-red-300 hover:bg-red-500/20 hover:text-red-200 transition"
                    >
                        <FaSignOutAlt />
                        Logout
                    </button>
                </div>
            </aside>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}