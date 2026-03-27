import Button from "../common/Button";
import SeatLegend from "./SeatLegend";

interface BookingFooterProps {
  selectedSeats: Set<string>;
  total: number;
  error: string | null;
  bookingLoading: boolean;
  onBook: () => void;
}

export default function BookingFooter({
  selectedSeats,
  total,
  error,
  bookingLoading,
  onBook,
}: BookingFooterProps) {
  return (
    <div className="shrink-0 border-t border-gray-800 bg-gray-900 px-6">
      {/* legend — always visible */}
      <div className="py-3 border-b border-gray-800">
        <SeatLegend />
      </div>

      {/* booking summary — grows when seats selected */}
      {selectedSeats.size === 0 ? (
        <div className="py-3 text-center text-gray-500 text-sm">
          Select seats to continue
        </div>
      ) : (
        <div className="py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-white text-sm font-medium">
              {selectedSeats.size} seat{selectedSeats.size > 1 ? "s" : ""}{" "}
              selected
            </p>
            <p className="text-green-400 font-bold text-lg">
              ₹{total.toFixed(2)}
            </p>
            {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
          </div>
          <Button
            onClick={onBook}
            disabled={bookingLoading}
            className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-8 py-3 rounded-xl transition whitespace-nowrap hover:cursor-pointer"
          >
            {bookingLoading ? "Booking..." : "Book Now"}
          </Button>
        </div>
      )}
    </div>
  );
}
