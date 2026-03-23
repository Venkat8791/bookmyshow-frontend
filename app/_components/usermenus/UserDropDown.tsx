import { User } from "@/app/types";
import Link from "next/link";

interface UserDropDownProps {
  user: User;
  setUserMenuOpen: (value: boolean) => void;
  handleLogout: () => void;
}

export default function UserDropDown({
  user,
  setUserMenuOpen,
  handleLogout,
}: UserDropDownProps) {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-700">
        <p className="text-white text-sm font-medium truncate">{user.name}</p>
        <p className="text-gray-400 text-xs truncate">{user.email}</p>
      </div>
      <Link
        href="/bookings/my"
        onClick={() => setUserMenuOpen(false)}
        className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 text-sm transition"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
          />
        </svg>
        My Bookings
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-gray-700 text-sm transition"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Sign Out
      </button>
    </div>
  );
}
