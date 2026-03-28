"use client";

import { useState, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaInfoCircle,
  FaServicestack,
  FaEnvelope,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { menu: "Home", link: "/", icon: FaHome },
  { menu: "About", link: "/about", icon: FaInfoCircle },
  { menu: "Services", link: "/services", icon: FaServicestack },
  { menu: "Contact", link: "/contact", icon: FaEnvelope },
];

const secondaryMenuItems = [
  { menu: "Profile", link: "/profile", icon: FaUser },
  { menu: "Settings", link: "/settings", icon: FaCog },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showText, setShowText] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();

  const handleToggleCollapse = () => {
    if (!isCollapsed) {
      setShowText(false);
      setTimeout(() => setIsCollapsed(true), 150);
    } else {
      setIsCollapsed(false);
      setTimeout(() => setShowText(true), 200);
    }
  };

  useEffect(() => {
    const savedCollapsed = localStorage.getItem("sidebarCollapsed");
    const savedDarkMode = localStorage.getItem("darkMode");

    if (savedCollapsed) {
      const collapsed = JSON.parse(savedCollapsed);
      setIsCollapsed(collapsed);
      setShowText(!collapsed);
    }

    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
      if (JSON.parse(savedDarkMode)) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // Reusable tooltip
  const Tooltip = ({ label }) => (
    <div
      className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md
      opacity-0 invisible group-hover:opacity-100 group-hover:visible
      pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-lg"
    >
      {label}
    </div>
  );

  // Reusable animated label
  const Label = ({ children }) => (
    <span
      className={`font-medium whitespace-nowrap transition-[opacity,max-width,margin] duration-200 ease-in-out overflow-hidden
        ${
          showText
            ? "opacity-100 max-w-[160px] ml-3"
            : "opacity-0 max-w-0 ml-0 pointer-events-none"
        }`}
    >
      {children}
    </span>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 right-4 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 shadow-2xl z-40
          transition-[width,transform] duration-300 ease-in-out overflow-hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${isCollapsed ? "w-20" : "w-64"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 h-16">
          {/* Logo + nama */}
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <div className="w-8 h-8 shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg" />
            <span
              className={`text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600
                bg-clip-text text-transparent whitespace-nowrap overflow-hidden
                transition-[opacity,max-width] duration-200 ease-in-out
                ${showText ? "opacity-100 max-w-[120px]" : "opacity-0 max-w-0"}`}
            >
              MyApp
            </span>
          </div>

          {/* Tombol collapse (fade out saat collapsed) */}
          <button
            onClick={handleToggleCollapse}
            className={`hidden md:flex shrink-0 items-center justify-center p-1 rounded-lg
              hover:bg-gray-100 dark:hover:bg-gray-800 transition-[opacity,colors] duration-200
              ${isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            aria-label="Collapse sidebar"
          >
            <FaChevronLeft
              size={16}
              className="text-gray-500 dark:text-gray-400"
            />
          </button>
        </div>

        {/* Tombol expand (muncul saat collapsed) */}
        <button
          onClick={handleToggleCollapse}
          className={`hidden md:flex absolute top-[14px] right-2 z-10 items-center justify-center p-1 rounded-lg
            hover:bg-gray-100 dark:hover:bg-gray-800 transition-[opacity,colors] duration-200
            ${isCollapsed ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          aria-label="Expand sidebar"
        >
          <FaChevronRight
            size={16}
            className="text-gray-500 dark:text-gray-400"
          />
        </button>

        {/* Navigation */}
        <nav className="flex-1 py-6 h-[calc(100%-8rem)] overflow-y-auto overflow-x-hidden">
          {/* Main Menu */}
          <div className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.link;
              const Icon = item.icon;
              return (
                <Link
                  key={item.menu}
                  href={item.link}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center rounded-xl transition-colors duration-200 group relative px-3 py-3
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                >
                  <Icon
                    className={`text-xl shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`}
                  />
                  <Label>{item.menu}</Label>
                  {!showText && <Tooltip label={item.menu} />}
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-gray-200 dark:border-gray-700 mx-3" />

          {/* Secondary Menu */}
          <div className="space-y-1 px-3">
            {secondaryMenuItems.map((item) => {
              const isActive = pathname === item.link;
              const Icon = item.icon;
              return (
                <Link
                  key={item.menu}
                  href={item.link}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center rounded-xl transition-colors duration-200 group relative px-3 py-3
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                >
                  <Icon
                    className={`text-xl shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`}
                  />
                  <Label>{item.menu}</Label>
                  {!showText && <Tooltip label={item.menu} />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center rounded-xl transition-colors duration-200 w-full group relative px-3 py-3 mb-2
              text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isDarkMode ? (
              <FaSun className="text-xl shrink-0" />
            ) : (
              <FaMoon className="text-xl shrink-0" />
            )}
            <Label>{isDarkMode ? "Light Mode" : "Dark Mode"}</Label>
            {!showText && (
              <Tooltip label={isDarkMode ? "Light Mode" : "Dark Mode"} />
            )}
          </button>

          {/* Logout */}
          <button
            className="flex items-center rounded-xl transition-colors duration-200 w-full group relative px-3 py-3
              text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <FaSignOutAlt className="text-xl shrink-0" />
            <Label>Logout</Label>
            {!showText && <Tooltip label="Logout" />}
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
