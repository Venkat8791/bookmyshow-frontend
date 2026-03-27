"use client";

import LoadingSpinner from "@/app/_components/common/LoadingSpinner";
import SeatCanvas from "@/app/_components/seats/SeatCanvas";
import SeatLegend from "@/app/_components/seats/SeatLegend";
import ShowTimePill from "@/app/_components/seats/ShowTimePill";
import { useAuth } from "@/app/context/AuthContext";
import { bookingService } from "@/app/services/bookingService";
import { showService } from "@/app/services/showService";
import { SeatAvailabilityResponse, Show } from "@/app/types";
import { CanvasSection } from "@/app/types/canvas";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Transform backend response to canvas format
function toCanvasSections(layout: SeatAvailabilityResponse): CanvasSection[] {
  return layout.sections.map((section) => ({
    sectionName: section.sectionName,
    seatType: section.seatType,
    finalPrice: section.finalPrice,
    rows: section.rows.map((row) => ({
      label: row.label,
      seats: row.seats.map((seat) => ({
        seatId: seat.seatId,
        columnNumber: seat.columnNumber,
        seatLabel: seat.seatLabel,
        isGap: seat.gap,
        isBlocked: seat.blocked,
        status: seat.status as "AVAILABLE" | "PENDING" | "BOOKED" | null,
      })),
    })),
  }));
}

export default function SeatLayoutPage() {
  const { id: showId } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const isMounted = useRef(true);

  //data state
  const [show, setShow] = useState<Show | null>(null);
  const [layout, setLayout] = useState<SeatAvailabilityResponse | null>(null);
  const [siblingShows, setSibilingShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  });

  //fetch show + layout
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        setSelectedSeats(new Set()); // reset selection on show change

        const [showRes, layoutRes] = await Promise.all([
          showService.getById(showId),
          showService.getSeatAvailability(showId),
        ]);

        if (!isMounted.current) return;
        setShow(showRes.data);
        setLayout(layoutRes.data);

        //fetch sibling shows for same movie
        const siblingRes = await showService.getByMovie(showRes.data.movieId);
        if (!isMounted.current) return;
        setSibilingShows(siblingRes.data);
      } catch (err: any) {
        if (axios.isCancel(err)) return;
        if (isMounted.current) setError("Failed to load seat layout");
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    fetchAll();
  }, [showId]);

  const handleSeatClick = (seatId: string) => {
    setSelectedSeats((prev) => {
      const next = new Set(prev);
      if (next.has(seatId)) {
        next.delete(seatId); // deselect
      } else {
        next.add(seatId); // select
      }
      return next;
    });
  };

  const handleBook = async () => {
    if (!user) {
      console.log("user not found");
      window.dispatchEvent(new CustomEvent("unauthorized"));
      return;
    }
    if (selectedSeats.size === 0) return;

    try {
      setBookingLoading(true);
      const response = await bookingService.create({
        showId,
        seatIds: Array.from(selectedSeats),
      });
      router.push(`/bookings/${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  // calculate total from selected seats
  const total =
    layout?.sections.reduce((acc, section) => {
      const count = section.rows.reduce((rowAcc, row) => {
        return (
          rowAcc +
          row.seats.filter((s) => s.seatId && selectedSeats.has(s.seatId))
            .length
        );
      }, 0);
      return acc + count * section.finalPrice;
    }, 0) ?? 0;

  // format show time
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error || !layout || !show) {
    return (
      <div
        className="flex items-center justify-center -mx-4 -my-6"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Failed to load"}</p>
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white text-sm transition"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const canvasSections = toCanvasSections(layout);

  // Flex column filling exactly the space below the sticky navbar (h-16 = 64px).
  // - header bar: shrink-0, fixed height
  // - canvas:     flex-1 + min-h-0 → takes ALL remaining space
  // - footer:     shrink-0, always visible, grows when seats are selected
  // ── Main layout ──────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col -mx-4 -my-6"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {/* ── Header ── */}
      <div className="shrink-0 px-6 py-3 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center justify-between">
          {/* back button + movie info */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-white font-semibold text-base leading-tight">
                {/* movie title would need a separate fetch — show screenId for now */}
                Seat Selection
              </h1>
              <p className="text-gray-400 text-xs mt-0.5">
                {formatTime(show.showTime)}
                {show.status && (
                  <span className="ml-2 text-gray-600">• {show.status}</span>
                )}
              </p>
            </div>
          </div>

          {/* show time switcher */}
          {siblingShows.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto max-w-sm">
              {siblingShows
                .filter((s) => s.status === "ACTIVE")
                .map((s) => (
                  <ShowTimePill
                    key={s.id}
                    time={formatTime(s.showTime)}
                    isActive={s.id === showId}
                    onClick={() => router.push(`/shows/${s.id}/seats`)}
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Canvas ── */}
      <div className="flex-1 min-h-0 bg-gray-950">
        <SeatCanvas
          sections={canvasSections}
          selectedSeats={selectedSeats}
          onSeatClick={handleSeatClick}
        />
      </div>

      {/* ── Footer ── */}
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
            <button
              onClick={handleBook}
              disabled={bookingLoading}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-8 py-3 rounded-xl transition whitespace-nowrap"
            >
              {bookingLoading ? "Booking..." : "Book Now"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
