"use client";
import { MenuProps } from "antd";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User2,
  LogOut,
  HomeIcon,
  MessageCircleMore,
  SearchIcon,
  LogIn,
} from "lucide-react";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Dropdown from "antd/es/dropdown/dropdown";
import { useRouter } from "next/navigation";
interface MenuItem {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function AppHeader() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const baseMenuItems: MenuItem[] = [
    {
      key: "home",
      label: "Trang chủ",
      href: "/",
      icon: <HomeIcon />,
    },
    {
      key: "chat",
      label: "Trò chuyện",
      href: "/chat",
      icon: <MessageCircleMore />,
    },
    {
      key: "search",
      label: "Tìm kiếm",
      href: "/search",
      icon: <SearchIcon />,
    },
  ];

  const mobileMenuItems: MenuItem[] = session
    ? [
        ...baseMenuItems,
        {
          key: "profile",
          label: "Hồ sơ",
          href: "/profile",
          icon: <User2 className="w-5 h-5" />,
        },
        {
          key: "signout",
          label: "Đăng xuất",
          href: "#",
          icon: <LogOut className="w-5 h-5" />,
        },
      ]
    : [
        ...baseMenuItems,
        {
          key: "login",
          label: "Đăng nhập",
          href: "/login",
          icon: <LogIn className="w-5 h-5" />,
        },
      ];

  const dropdownItems: MenuProps["items"] = [
    {
      key: "profile",
      label: <Link href="/profile">Hồ sơ</Link>,
      icon: <User2 className="w-5 h-5" />,
    },
    {
      key: "signout",
      label: (
        <span
          onClick={() => signOut()}
          className="text-red-500 hover:text-red-600"
        >
          Đăng xuất
        </span>
      ),
      icon: <LogOut className="w-5 h-5" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-blue-600 flex items-center gap-3 hover:text-blue-700 transition duration-200"
        >
          <Image
            src="/logo/logo-forum-2025.png"
            alt="Forum Logo"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full shadow-sm hover:scale-110 transition duration-200"
            priority
          />
          Forum
        </Link>
        <nav className="hidden md:flex space-x-4 items-center">
          {baseMenuItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition"
              onClick={(e) => {
                e.preventDefault();
                router.push(item.href, { scroll: false });
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          {session && session.user?.image ? (
            <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
              <Image
                src={session.user.image}
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full cursor-pointer"
              />
            </Dropdown>
          ) : (
            <Link href="/login" className="group">
              <button className="flex items-center gap-2 px-2 py-1 rounded-full cursor-pointer transition duration-200">
                <LogIn className="w-5 h-5 text-blue-500 transition-colors duration-200 group-hover:text-blue-300" />
                <span className="text-blue-500 font-normal transition-colors duration-200 group-hover:text-blue-300">
                  Đăng nhập
                </span>
              </button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-blue-600 cursor-pointer"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-4"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="mb-4 p-2 text-gray-600 hover:text-blue-600 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              <nav className="flex flex-col space-y-2">
                {mobileMenuItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md ${
                      item.key === "signout"
                        ? "text-red-500 hover:text-red-600"
                        : ""
                    }`}
                    onClick={() => {
                      if (item.key === "signout") {
                        signOut();
                      }
                      setIsOpen(false);
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
                {session && session.user?.image && (
                  <div className="flex items-center space-x-2 p-2">
                    <Image
                      src={session.user.image}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="text-gray-600">{session.user?.name}</span>
                  </div>
                )}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
