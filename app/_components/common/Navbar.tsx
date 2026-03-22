"use client";

import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-red-500 font-bold text-2xl">
          🎬 BookMyShow
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-300 hover:text-white transition">
            Movies
          </Link>
          {user ? (
            <>
              <Link
                href="/bookings/my"
                className="text-gray-300 hover:text-white transition"
              >
                My Bookings
              </Link>
              <span className="text-gray-400 text-sm">{user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-gray-300 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
