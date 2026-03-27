"use client";

import LoadingSpinner from "@/app/_components/common/LoadingSpinner";
import BookingFooter from "@/app/_components/seats/BookingFooter";
import SeatCanvas from "@/app/_components/seats/SeatCanvas";
import SeatLayoutHeader from "@/app/_components/seats/SeatLayoutHeader";
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

  if (loading) {
    return <LoadingSpinner />;
  }

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

  return (
    <div
      className="flex flex-col -mx-4 -my-6"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <SeatLayoutHeader
        show={show}
        siblingShows={siblingShows}
        showId={showId}
        onBack={() => router.back()}
        onShowSelect={(id) => router.push(`/shows/${id}/seats`)}
      />

      <div className="flex-1 min-h-0 bg-gray-950">
        <SeatCanvas
          sections={canvasSections}
          selectedSeats={selectedSeats}
          onSeatClick={handleSeatClick}
        />
      </div>

      <BookingFooter
        selectedSeats={selectedSeats}
        total={total}
        error={error}
        bookingLoading={bookingLoading}
        onBook={handleBook}
      />
    </div>
  );
}
