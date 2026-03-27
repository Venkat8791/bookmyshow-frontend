import { Booking } from "@/app/types";
import SeatChip from "../seats/SeatChip";

export default function BookingSummaryCard({ booking }: { booking: Booking }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-sm">Booking ID</span>
        <span className="text-white text-sm font-mono">
          #{booking.id.substring(0, 8).toUpperCase()}
        </span>
      </div>

      <div className="flex items-start justify-between">
        <span className="text-gray-400 text-sm">Seats</span>
        <div className="flex flex-wrap gap-1.5 justify-end max-w-xs">
          {booking.seats.map((seat) => (
            <SeatChip key={seat.seatId} label={seat.seatLabel ?? seat.seatId} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-sm">Seat count</span>
        <span className="text-white text-sm">
          {booking.seats.length} seat{booking.seats.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="border-t border-gray-800 pt-4 flex items-center justify-between">
        <span className="text-gray-400 text-sm">Total amount</span>
        <span className="text-white font-bold text-xl">
          ₹{booking.totalAmount.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
