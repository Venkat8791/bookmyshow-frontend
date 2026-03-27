"use client";

import ConfirmedTicket from "@/app/_components/bookings/ConfirmedTicket";
import PendingPayment from "@/app/_components/bookings/PendingPayment";
import LoadingSpinner from "@/app/_components/common/LoadingSpinner";
import { bookingService } from "@/app/services/bookingService";
import { Booking } from "@/app/types";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BookingConfirmationPage() {
  const { id: bookingId } = useParams<{ id: string }>();
  const isMounted = useRef(true);

  const [booking, setBooking] = useState<Booking | null>(null);
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
        const response = await bookingService.getById(bookingId);
        if (isMounted.current) setBooking(response.data);
      } catch (err: any) {
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
    } catch (err: any) {
      if (isMounted.current) {
        setPayError(err.response?.data?.message || "Payment failed");
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
      <div className="flex flex-col items-center justify-center min-h-64 text-center">
        <p className="text-red-400 mb-4">{error || "Booking not found"}</p>
        <Link
          href="/"
          className="text-gray-400 hover:text-white text-sm transition"
        >
          ← Go home
        </Link>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-md mx-auto py-8 px-4">
      {booking.status === "CONFIRMED" ? (
        <ConfirmedTicket booking={booking} />
      ) : booking.status === "CANCELLED" ? (
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-white text-xl font-bold mb-2">
            Booking Cancelled
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            This booking has been cancelled
          </p>
          <Link
            href="/"
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-8 py-3 rounded-xl transition"
          >
            Book Again
          </Link>
        </div>
      ) : (
        <PendingPayment
          booking={booking}
          onPay={handlePay}
          loading={payLoading}
          error={payError}
        />
      )}
    </div>
  );
}
