import { Booking, Movie, Show } from "@/app/types";
import Link from "next/link";
import SeatChip from "../seats/SeatChip";
import MovieInfo from "./MovieInfo";
import StatusCard from "../common/StatusCard";

interface ConfirmedTicketProps {
  booking: Booking;
  show: Show | null;
  movie: Movie | null;
}

export default function ConfirmedTicket({
  booking,
  show,
  movie,
}: ConfirmedTicketProps) {
  return (
    <div className="flex flex-col items-center">
      <StatusCard
        variant="success"
        title="Booking Confirmed!"
        description="Your seats have been successfully booked"
      />

      <div className="w-full max-w-sm">
        {/* movie info */}
        {movie && show && <MovieInfo movie={movie} show={show} />}

        {/* ticket card */}
        <div>
          {/* ticket top */}
          <div className="bg-gray-900 border border-gray-800 rounded-t-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">BOOKING ID</span>
              <span className="text-white text-xs font-mono font-bold">
                #{booking.id.substring(0, 8).toUpperCase()}
              </span>
            </div>

            <div>
              <p className="text-gray-400 text-xs mb-1.5">SEATS</p>
              <div className="flex flex-wrap gap-1.5">
                {booking.seats.map((seat) => (
                  <SeatChip
                    key={seat.seatId}
                    label={seat.seatLabel ?? seat.seatId}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
              <span className="text-gray-400 text-xs">TOTAL PAID</span>
              <span className="text-green-400 font-bold text-lg">
                ₹{booking.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* ticket divider — dashed cutline */}
          <div className="relative bg-gray-900 border-x border-gray-800">
            <div className="border-t border-dashed border-gray-700 mx-4" />
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-950 rounded-full border border-gray-800" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-950 rounded-full border border-gray-800" />
          </div>

          {/* ticket bottom */}
          <div className="bg-gray-900 border border-t-0 border-gray-800 rounded-b-2xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">STATUS</span>
              <span className="bg-green-500/10 text-green-400 text-xs px-2.5 py-1 rounded-full font-medium">
                CONFIRMED
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-400 text-xs">PAYMENT</span>
              <span className="bg-green-500/10 text-green-400 text-xs px-2.5 py-1 rounded-full font-medium">
                PAID
              </span>
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="flex gap-3 mt-6">
          <Link
            href="/bookings/my"
            className="flex-1 text-center bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium py-3 rounded-xl transition"
          >
            My Bookings
          </Link>
          <Link
            href="/"
            className="flex-1 text-center bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-3 rounded-xl transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
