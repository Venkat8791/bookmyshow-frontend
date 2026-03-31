import { Booking, Movie, Show } from "@/app/types";
import { useRouter } from "next/navigation";
import StatusBadge from "./StatusBadge";
import PaymentBadge from "./PaymentBadge";
import Link from "next/link";

interface EnrichedBooking {
  booking: Booking;
  show: Show | null;
  movie: Movie | null;
}

interface BookingCardProps {
  enriched: EnrichedBooking;
  onCancel: (bookingId: string) => void;
  cancelling: string | null;
}

// ── Booking card ──────────────────────────────────────────────────────────────
export default function BookingCard({
  enriched,
  onCancel,
  cancelling,
}: BookingCardProps) {
  const { booking, show, movie } = enriched;
  const router = useRouter();

  const formatShowTime = (isoString: string) =>
    new Date(isoString).toLocaleString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const formatBookedAt = (isoString: string) =>
    new Date(isoString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const canCancel =
    booking.status === "PENDING" || booking.status === "CONFIRMED";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition">
      <div className="flex gap-3 p-4 sm:gap-4 sm:p-5">
        {/* movie poster */}
        <div className="flex-shrink-0 w-14 h-20 bg-gray-800 rounded-xl overflow-hidden">
          {movie?.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl">
              🎬
            </div>
          )}
        </div>

        {/* booking info */}
        <div className="flex-1 min-w-0">
          {/* title + badges */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-white font-semibold text-sm leading-tight truncate">
              {movie?.title ?? "Loading..."}
            </h3>
            <div className="flex gap-1.5 flex-shrink-0">
              <StatusBadge status={booking.status} />
            </div>
          </div>

          {/* show time */}
          {show && (
            <p className="text-gray-400 text-xs mb-1">
              🕐 {formatShowTime(show.showTime)}
            </p>
          )}

          {/* seats */}
          <div className="flex flex-wrap gap-1 mb-2">
            {booking.seats.slice(0, 4).map((seat) => (
              <span
                key={seat.seatId}
                className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded font-mono"
              >
                {seat.seatLabel ?? seat.seatId.substring(0, 6)}
              </span>
            ))}
            {booking.seats.length > 4 && (
              <span className="text-gray-500 text-xs py-0.5">
                +{booking.seats.length - 4} more
              </span>
            )}
          </div>

          {/* footer row */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <PaymentBadge status={booking.paymentStatus} />
              <span className="text-white font-bold text-sm">
                ₹{booking.totalAmount.toFixed(2)}
              </span>
            </div>
            <p className="text-gray-600 text-xs">
              {formatBookedAt(booking.bookedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* actions */}
      <div className="border-t border-gray-800 px-4 py-3 sm:px-5 flex flex-wrap items-center justify-between gap-2">
        <Link
          href={`/bookings/${booking.id}`}
          className="text-gray-400 hover:text-white text-xs transition"
        >
          View details →
        </Link>

        <div className="flex items-center gap-2">
          {/* complete payment if pending */}
          {booking.status === "PENDING" &&
            booking.paymentStatus === "UNPAID" && (
              <button
                onClick={() => router.push(`/bookings/${booking.id}`)}
                className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
              >
                Complete Payment
              </button>
            )}

          {/* cancel button */}
          {canCancel && (
            <button
              onClick={() => onCancel(booking.id)}
              disabled={cancelling === booking.id}
              className="text-gray-500 hover:text-red-400 text-xs transition disabled:opacity-50"
            >
              {cancelling === booking.id ? "Cancelling..." : "Cancel"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
