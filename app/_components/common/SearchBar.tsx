import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ isMobile }: { isMobile: boolean }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`${isMobile ? "relative" : "relative flex-1 max-w-md hidden md:flex"}`}
    >
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
      </span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies, events, plays..."
        className="w-full bg-gray-800 text-white text-sm pl-9 pr-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 transition placeholder-gray-500"
      />
    </form>
  );
}
