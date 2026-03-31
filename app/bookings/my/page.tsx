"use client";

import BookingCard from "@/app/_components/bookings/BookingCard";
import EmptyState from "@/app/_components/bookings/EmptyState";
import FilterTabs from "@/app/_components/bookings/FilterTabs";
import LoadingSpinner from "@/app/_components/common/LoadingSpinner";
import Button from "@/app/_components/common/Button";
import { useAuth } from "@/app/context/AuthContext";
import { bookingService } from "@/app/services/bookingService";
import { movieService } from "@/app/services/movieService";
import { showService } from "@/app/services/showService";
import { Booking, Movie, Show } from "@/app/types";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface EnrichedBooking {
  booking: Booking;
  show: Show | null;
  movie: Movie | null;
}
type FilterType = "ALL" | "CONFIRMED" | "PENDING" | "CANCELLED";

export default function MyBookingsPage() {
  const { user } = useAuth();

  const router = useRouter();
  const isMounted = useRef(true);

  const [enrichedBookings, setEnrichedBookings] = useState<EnrichedBooking[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("ALL");

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  //redirect if not logged in
  useEffect(() => {
    if (isMounted.current && !user) {
      router.push("/");
      window.dispatchEvent(new CustomEvent("unauthorized"));
    }
  }, [isMounted, user, router]);

  // fetch bookings + enrich with show + movie
  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const bookingsRes = await bookingService.getMyBookings();
        if (!isMounted.current) return;

        const bookings = bookingsRes.data;

        if (bookings.length === 0) {
          setEnrichedBookings([]);
          return;
        }

        // enrich each booking with show + movie in parallel
        const enriched = await Promise.all(
          bookings.map(async (booking) => {
            try {
              const showRes = await showService.getById(booking.showId);
              const movieRes = await movieService.getById(showRes.data.movieId);
              return {
                booking,
                show: showRes.data,
                movie: movieRes.data,
              };
            } catch {
              return { booking, show: null, movie: null };
            }
          }),
        );

        if (!isMounted.current) return;

        // sort by bookedAt descending (newest first)
        enriched.sort(
          (a, b) =>
            new Date(b.booking.bookedAt).getTime() -
            new Date(a.booking.bookedAt).getTime(),
        );

        setEnrichedBookings(enriched);
      } catch (err: any) {
        if (isMounted.current) setError("Failed to load bookings");
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  // cancel booking
  const handleCancel = async (bookingId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );
    if (!confirmed) return;

    try {
      setCancelling(bookingId);
      await bookingService.cancel(bookingId);

      // update local state
      setEnrichedBookings((prev) =>
        prev.map((e) =>
          e.booking.id === bookingId
            ? {
                ...e,
                booking: {
                  ...e.booking,
                  status: "CANCELLED",
                  paymentStatus:
                    e.booking.paymentStatus === "PAID" ? "REFUNDED" : "UNPAID",
                },
              }
            : e,
        ),
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelling(null);
    }
  };

  // filter bookings
  const filtered =
    filter === "ALL"
      ? enrichedBookings
      : enrichedBookings.filter((e) => e.booking.status === filter);

  // counts for filter tabs
  const counts: Record<FilterType, number> = {
    ALL: enrichedBookings.length,
    CONFIRMED: enrichedBookings.filter((e) => e.booking.status === "CONFIRMED")
      .length,
    PENDING: enrichedBookings.filter((e) => e.booking.status === "PENDING")
      .length,
    CANCELLED: enrichedBookings.filter((e) => e.booking.status === "CANCELLED")
      .length,
  };

  if (!isMounted.current || loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="text-gray-400 hover:text-white text-sm transition"
        >
          Try again
        </Button>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">My Bookings</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {enrichedBookings.length} booking
            {enrichedBookings.length !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>

      {enrichedBookings.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* filter tabs */}
          <div className="mb-5">
            <FilterTabs active={filter} onChange={setFilter} counts={counts} />
          </div>

          {/* bookings list */}
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              No {filter.toLowerCase()} bookings
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((enriched) => (
                <BookingCard
                  key={enriched.booking.id}
                  enriched={enriched}
                  onCancel={handleCancel}
                  cancelling={cancelling}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
