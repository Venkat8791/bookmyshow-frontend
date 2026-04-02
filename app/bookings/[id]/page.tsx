"use client";

import ConfirmedTicket from "@/app/_components/bookings/ConfirmedTicket";
import PendingPayment from "@/app/_components/bookings/PendingPayment";
import LoadingSpinner from "@/app/_components/common/LoadingSpinner";
import { bookingService } from "@/app/services/bookingService";
import { movieService } from "@/app/services/movieService";
import { showService } from "@/app/services/showService";
import { Booking, Movie, Show } from "@/app/types";
import axios from "axios";
import ErrorAlert from "@/app/_components/common/ErrorAlert";
import StatusCard from "@/app/_components/common/StatusCard";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BookingConfirmationPage() {
  const { id: bookingId } = useParams<{ id: string }>();
  const isMounted = useRef(true);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [show, setShow] = useState<Show | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // fetch booking
  useEffect(() => {
    const controller = new AbortController();

    const fetchBooking = async () => {
      try {
        setLoading(true);
        // step 1 — fetch booking
        const bookingRes = await bookingService.getById(bookingId);
        if (!isMounted.current) return;
        setBooking(bookingRes.data);

        // step 2 — fetch show
        const showRes = await showService.getById(bookingRes.data.showId);
        if (!isMounted.current) return;
        setShow(showRes.data);

        // step 3 — fetch movie
        const movieRes = await movieService.getById(showRes.data.movieId);
        if (!isMounted.current) return;
        setMovie(movieRes.data);
      } catch (err) {
        if (axios.isCancel(err)) return;
        if (isMounted.current) setError("Failed to load booking");
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    fetchBooking();
    return () => controller.abort();
  }, [bookingId]);

  // simulate payment
  const handlePay = useCallback(async () => {
    if (!booking) return;
    try {
      setPayLoading(true);
      setPayError(null);
      const response = await bookingService.confirmPayment(booking.id, {
        paymentReference: `PAY_${Date.now()}`, // simulated reference
      });
      if (isMounted.current) setBooking(response.data);
    } catch (err) {
      if (isMounted.current) {
        const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
        setPayError(message || "Payment failed");
      }
    } finally {
      if (isMounted.current) setPayLoading(false);
    }
  }, [booking]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return <LoadingSpinner />;
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error || !booking) {
    return (
      <ErrorAlert
        variant="page"
        message={error || "Booking not found"}
        action={{ label: "← Go home", href: "/" }}
      />
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-md mx-auto py-8 px-4">
      {booking.status === "CONFIRMED" ? (
        <ConfirmedTicket show={show} movie={movie} booking={booking} />
      ) : booking.status === "CANCELLED" ? (
        <StatusCard
          variant="cancelled"
          title="Booking Cancelled"
          description="This booking has been cancelled"
          action={{ label: "Book Again", href: "/" }}
        />
      ) : (
        <PendingPayment
          booking={booking}
          onPay={handlePay}
          loading={payLoading}
          error={payError}
          show={show}
          movie={movie}
        />
      )}
    </div>
  );
}
