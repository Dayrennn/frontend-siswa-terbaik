"use client";

import {
  FaHome,
  FaUsers,
  FaChalkboardTeacher,
  FaClipboardList,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaGraduationCap,
} from "react-icons/fa";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  logout as logoutAction,
  selectUser,
} from "../../../hooks/api/authSliceAPI";
import { useLogoutMutation } from "../../../hooks/api/userSliceAPI";
import { useState } from "react";
import LogoutModal from "../modal/logoutModal";

const menuItems = [
  {
    menu: "Dashboard",
    icon: FaHome,
    roles: [
      "Admin",
      "Guru",
      "WaliKelas",
      "KepalaSekolah",
      "WakilKepalaSekolah",
    ],
    links: {
      Admin: "/dashboard/admin",
      Guru: "/dashboard/guru",
      WaliKelas: "/dashboard/wali-kelas",
      KepalaSekolah: "/dashboard/kepala-sekolah",
      WakilKepalaSekolah: "/dashboard/wakil-kepala-sekolah",
    },
  },
  {
    menu: "Data Pelajaran",
    link: "/page/data-pelajaran",
    icon: FaUsers,
    roles: [
      "Admin",
      "Guru",
      "WaliKelas",
      "KepalaSekolah",
      "WakilKepalaSekolah",
    ],
  },
  {
    menu: "Data Siswa",
    link: "/page/data-siswa",
    icon: FaChalkboardTeacher,
    roles: [
      "Admin",
      "Guru",
      "WaliKelas",
      "KepalaSekolah",
      "WakilKepalaSekolah",
    ],
  },
  {
    menu: "Data Kriteria",
    link: "/dashboard/data-kriteria",
    icon: FaClipboardList,
    roles: [
      "Admin",
      "Guru",
      "WaliKelas",
      "KepalaSekolah",
      "WakilKepalaSekolah",
    ],
  },
  {
    menu: "Hitung Nilai",
    link: "/dashboard/hitung-nilai",
    icon: FaClipboardList,
    roles: ["Admin", "WakilKepalaSekolah"],
  },
  {
    menu: "Data Ranking",
    link: "/dashboard/data-ranking",
    icon: FaClipboardList,
    roles: [
      "Admin",
      "Guru",
      "WaliKelas",
      "KepalaSekolah",
      "WakilKepalaSekolah",
    ],
  },
  {
    menu: "Data User",
    link: "/page/data-user",
    icon: FaClipboardList,
    roles: ["Admin"],
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [logoutApi, { isLoading: isLogoutLoading }] = useLogoutMutation();

  const filteredMenu = menuItems
    .filter((item) => item.roles.includes(user?.role))
    .map((item) => ({
      ...item,
      link: item.links ? item.links[user?.role] : item.link,
    }));

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logoutAction());
      router.push("/login");
    } catch (error) {
      console.error("Logout gagal", error);
    }
  };

  return (
    <>
      {/* Modal */}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
          isLoading={isLogoutLoading}
        />
      )}

      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full w-60 z-40 transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{
          background:
            "linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%)",
        }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <FaGraduationCap className="text-white text-sm" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">
              Sistem Siswa
            </p>
            <p className="text-indigo-300 text-xs mt-0.5">Admin Panel</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-3 mt-2 space-y-1">
          <p className="text-indigo-400 text-xs font-semibold px-3 mb-2 uppercase tracking-widest">
            Menu
          </p>
          {filteredMenu.map(({ menu, link, icon: Icon }) => {
            const isActive = pathname === link;
            return (
              <Link
                key={menu}
                href={link}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive ? "bg-white/20 text-white shadow-sm" : "text-indigo-200 hover:bg-white/10 hover:text-white"}`}
              >
                <span
                  className={`w-1 h-5 rounded-full mr-0.5 shrink-0 transition-all duration-200
                  ${isActive ? "bg-white" : "bg-transparent"}`}
                />
                <Icon className="text-base shrink-0" />
                {menu}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="bg-white/10 rounded-xl px-3 py-2.5 mb-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-400/40 flex items-center justify-center shrink-0">
              <FaUsers className="text-white text-xs" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user?.username ?? "Loading..."}
              </p>
              <p className="text-indigo-300 text-xs truncate">
                {user?.email ?? ""}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full
              text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200"
          >
            <FaSignOutAlt className="text-base shrink-0" />
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

      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
          isLoading={isLogoutLoading}
        />
      )}
    </>
  );
}
