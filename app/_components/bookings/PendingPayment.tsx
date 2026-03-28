import { Booking, Movie, Show } from "@/app/types";
import { useRouter } from "next/navigation";
import useCountdown from "../hooks/useCountdown";
import BookingSummaryCard from "./BookingSummaryCard";
import ErrorAlert from "../common/ErrorAlert";
import Button from "../common/Button";
import MovieInfo from "./MovieInfo";

interface PendingPaymentProps {
  booking: Booking;
  onPay: () => void;
  loading: boolean;
  error: string | null;
  show: Show | null;
  movie: Movie | null;
}

// ── Pending payment ───────────────────────────────────────────────────────────
export default function PendingPayment({
  booking,
  onPay,
  loading,
  error,
  show,
  movie,
}: PendingPaymentProps) {
  const { mins, secs, isExpired, isUrgent } = useCountdown(booking.expiresAt);
  const router = useRouter();

  if (isExpired) {
    return (
      <div className="flex flex-col items-center text-center">
        {/* expired icon */}
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-white text-xl font-bold mb-2">Booking Expired</h1>
        <p className="text-gray-400 text-sm mb-6">
          Your seat hold has expired. Please select seats again.
        </p>
        <Button
          onClick={() => router.back()}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-8 py-3 rounded-xl transition"
        >
          Select Seats Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-sm">
      <h1 className="text-white text-xl font-bold mb-1">Complete Payment</h1>
      <p className="text-gray-400 text-sm mb-6">
        Your seats are held temporarily
      </p>

      {/* movie info ← add here */}
      {movie && show && <MovieInfo movie={movie} show={show} />}

      {/* countdown timer */}
      <div
        className={`flex items-center gap-2 mb-6 px-4 py-2.5 rounded-xl border
          ${
            isUrgent
              ? "bg-red-500/10 border-red-500/30 text-red-400"
              : "bg-gray-800 border-gray-700 text-gray-300"
          }`}
      >
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm">
          Complete payment in{" "}
          <span className="font-mono font-bold">
            {mins}:{secs}
          </span>
        </span>
      </div>

      {/* booking summary */}
      <div className="w-full mb-6">
        <BookingSummaryCard booking={booking} />
      </div>

      {/* error */}
      {error && <ErrorAlert message={error} />}

      {/* pay button */}
      <Button
        onClick={onPay}
        disabled={loading}
        className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition text-sm"
      >
        {loading ? "Processing..." : `Pay ₹${booking.totalAmount.toFixed(2)}`}
      </Button>

      <p className="text-gray-600 text-xs mt-3 text-center">
        This is a simulated payment for demo purposes
      </p>
    </div>
  );
}
