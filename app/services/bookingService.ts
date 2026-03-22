import { Booking } from "../types";
import api from "./api";
import { AxiosResponse } from "axios";

interface BookingRequest {
  showId: string;
  seatIds: string[];
}

interface PaymentRequest {
  paymentReference: string;
}

export const bookingService = {
  create: (data: BookingRequest): Promise<AxiosResponse<Booking>> =>
    api.post("/bookings", data),

  getById: (id: string): Promise<AxiosResponse<Booking>> =>
    api.get(`/bookings/${id}`),

  getMyBookings: (): Promise<AxiosResponse<Booking[]>> =>
    api.get("/bookings/my"),

  confirmPayment: (
    id: string,
    data: PaymentRequest,
  ): Promise<AxiosResponse<Booking>> =>
    api.post(`/bookings/${id}/confirm-payment`, data),

  cancel: (id: string): Promise<AxiosResponse<void>> =>
    api.patch(`/bookings/${id}/cancel`),
};
