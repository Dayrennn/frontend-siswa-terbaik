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

const menuItems = [
    {
        menu: 'Dashboard',
        icon: FaHome,
        roles: ['Admin', 'Guru', 'WaliKelas', 'KepalaSekolah', 'WakilKepalaSekolah'],
        links: {
            Admin: '/dashboard/admin',
            Guru: '/dashboard/guru',
            WaliKelas: '/dashboard/wali-kelas',
            KepalaSekolah: '/dashboard/kepala-sekolah',
            WakilKepalaSekolah: '/dashboard/wakil-kepala-sekolah',
        },
    },

    {
        menu: 'Menu Siswa',
        icon: FaUsers,
        roles: ['Admin', 'Guru', 'WaliKelas', 'KepalaSekolah', 'WakilKepalaSekolah'],
        children: [
            { menu: 'Data Pelajaran', link: '/page/data-pelajaran' },
            { menu: 'Data Siswa', link: '/page/data-siswa' },
            { menu: 'Data Kelas', link: '/page/data-kelas' },
            { menu: 'Data Tahun Ajaran', link: '/page/tahun-ajaran' },
            { menu: 'Data Pelanggaran', link: '/page/data-pelanggaran' },
            { menu: 'Data Eskul', link: '/page/data-eskul' },
            { menu: 'Data Absen', link: '/page/data-absen' },
        ],
    },

    {
        menu: 'Penilaian',
        icon: FaClipboardList,
        roles: ['Admin', 'Guru', 'WaliKelas', 'KepalaSekolah', 'WakilKepalaSekolah'],
        children: [
            { menu: 'Data Kriteria', link: '/page/data-kriteria' },
            { menu: 'Data Nilai', link: '/page/data-nilai' },
            { menu: 'Data Ranking', link: '/page/data-ranking' },
            { menu: 'Hitung Nilai', link: '/page/hitung-nilai' },
        ],
    },
    {
        menu: 'Master Data',
        icon: FaUsers,
        roles: ['Admin'],
        children: [{ menu: 'Data User', link: '/page/data-user' }],
    },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState([]);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const [logoutApi, { isLoading: isLogoutLoading }] = useLogoutMutation();

    /* FILTER ROLE */
    const filteredMenu = menuItems
        .filter((item) => item.roles.includes(user?.role))
        .map((item) => ({
            ...item,
            link: item.links ? item.links[user?.role] : item.links,
        }));

    /* TOGGLE MENU (MULTI) */
    const toggleMenu = (menu) => {
        setOpenMenus((prev) => (prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]));
    };

    useEffect(() => {
        setOpenMenus((prev) => {
            const activeMenus = [...prev];

            filteredMenu.forEach((item) => {
                if (item.children?.some((c) => c.link === pathname) && !activeMenus.includes(item.menu)) {
                    activeMenus.push(item.menu);
                }
            });

            return activeMenus;
        });
    }, [pathname]);

    /* CLOSE MOBILE SAAT DESKTOP */
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /* LOGOUT */
    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
            dispatch(logoutAction());
            router.push('/login');
        } catch (error) {
            console.error('Logout gagal', error);
        }
    };

    return (
        <>
            {/* MODAL */}
            {showLogoutModal && (
                <LogoutModal
                    onConfirm={handleLogout}
                    onCancel={() => setShowLogoutModal(false)}
                    isLoading={isLogoutLoading}
                />
            )}

            {/* MOBILE BUTTON */}
            <button
                className="fixed top-4 left-4 z-50 bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg md:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>

            {/* SIDEBAR */}
            <aside
                className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300
        w-[80%] sm:w-64 md:w-60 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
                style={{
                    background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%)',
                }}
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
                <nav
                    className="
          flex-1 overflow-y-auto p-3 mt-2 space-y-1
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-thumb]:bg-indigo-500
          [&::-webkit-scrollbar-thumb]:rounded-full
        "
                >
                    <p className="text-indigo-400 text-xs font-semibold px-3 mb-2 uppercase tracking-widest">Menu</p>

                    {filteredMenu.map((item) => {
                        const Icon = item.icon;

                        /* SINGLE */
                        if (!item.children) {
                            const isActive = pathname === item.link;

                            return (
                                <Link
                                    key={item.menu}
                                    href={item.link}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    ${isActive ? 'bg-white/20 text-white' : 'text-indigo-200 hover:bg-white/10 hover:text-white'}`}
                                >
                                    <Icon />
                                    {item.menu}
                                </Link>
                            );
                        }

                        const isParentActive = item.children.some(
                            (child) => pathname === child.link || pathname.startsWith(child.link + '/'),
                        );

                        return (
                            <div key={item.menu}>
                                {/* PARENT */}
                                <button
                                    onClick={() => toggleMenu(item.menu)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium
                    ${
                        isParentActive ? 'bg-white/20 text-white' : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon />
                                        {item.menu}
                                    </div>

                                    {/* ROTATE ICON */}
                                    <FaChevronDown
                                        className={`transition-transform duration-300 ${
                                            openMenus.includes(item.menu) ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>

                                {/* CHILD WITH ANIMATION */}
                                <div
                                    className={`ml-6 overflow-hidden transition-all duration-300
                    ${openMenus.includes(item.menu) ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="space-y-1">
                                        {item.children.map((child) => {
                                            const isActive =
                                                pathname === child.link || pathname.startsWith(child.link + '/');

                                            return (
                                                <Link
                                                    key={child.menu}
                                                    href={child.link}
                                                    onClick={() => setIsOpen(false)}
                                                    className={`block px-3 py-2 rounded-lg text-sm
                            ${
                                isActive
                                    ? 'bg-white/20 text-white'
                                    : 'text-indigo-300 hover:bg-white/10 hover:text-white'
                            }`}
                                                >
                                                    {child.menu}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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

            {/* OVERLAY */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
