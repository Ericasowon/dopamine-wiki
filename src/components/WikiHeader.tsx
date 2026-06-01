"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Search, User, ChevronDown } from "lucide-react";
import { useState } from "react";

interface WikiHeaderProps {
  wikiTitle: string;
  username: string;
  isOwner: boolean;
}

export default function WikiHeader({ wikiTitle, username, isOwner }: WikiHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header style={{ backgroundColor: "#1a6e3c" }} className="text-white px-4 py-2 flex items-center gap-4">
      {/* Logo / Title */}
      <Link
        href={`/wiki/${username}`}
        className="flex items-center gap-2 font-bold text-lg whitespace-nowrap"
      >
        <span>🌿</span>
        <span>{wikiTitle}</span>
      </Link>

      {/* Search bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="w-full px-3 py-1.5 rounded text-gray-800 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <Search className="absolute right-2 top-1.5 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Navigation links + user dropdown */}
      <nav className="flex items-center gap-4 text-sm">
        <Link href="#" className="hover:underline opacity-90 whitespace-nowrap">
          최근 변경
        </Link>
        <Link href="#" className="hover:underline opacity-90 whitespace-nowrap">
          임의의 문서
        </Link>
        <Link href="#" className="hover:underline opacity-90 whitespace-nowrap">
          도움말
        </Link>
        <Link
          href={`/wiki/${username}`}
          className="hover:underline opacity-90 whitespace-nowrap"
        >
          개인 위키 홈
        </Link>

        {/* User avatar dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1 hover:bg-white/30 transition-colors"
          >
            <User className="w-4 h-4" />
            <span className="whitespace-nowrap">{username}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showDropdown && (
            <>
              {/* Backdrop to close dropdown on outside click */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 top-9 bg-white text-gray-800 rounded shadow-lg py-1 min-w-[8rem] z-50 border border-gray-200">
                <Link
                  href={`/wiki/${username}`}
                  className="block px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => setShowDropdown(false)}
                >
                  내 위키
                </Link>
                {isOwner && (
                  <Link
                    href="/settings"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => setShowDropdown(false)}
                  >
                    설정
                  </Link>
                )}
                <hr className="my-1 border-gray-200" />
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                >
                  로그아웃
                </button>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
