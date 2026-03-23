import { User } from "@/app/types";

interface UserDropDownProps {
  user: User;
  userMenuOpen: boolean;
  setUserMenuOpen: (value: boolean) => void;
}

export default function UserName({
  user,
  userMenuOpen,
  setUserMenuOpen,
}: UserDropDownProps) {
  return (
    <button
      onClick={() => setUserMenuOpen(!userMenuOpen)}
      className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg transition"
    >
      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
        {user.name.charAt(0).toUpperCase()}
      </div>
      <span className="hidden sm:block max-w-[80px] truncate">{user.name}</span>
      <svg
        className="w-3 h-3 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
}
