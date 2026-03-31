import Link from "next/link";

// ── Empty state ───────────────────────────────────────────────────────────────
export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">🎬</div>
      <h2 className="text-white font-semibold text-lg mb-2">No bookings yet</h2>
      <p className="text-gray-400 text-sm mb-6">
        Your booking history will appear here
      </p>
      <Link
        href="/"
        className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition"
      >
        Browse Movies
      </Link>
    </div>
  );
}
