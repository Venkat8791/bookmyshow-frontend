export interface Movie {
  id: string;
  title: string;
  description: string;
  language: string;
  genre: string;
  durationMinutes: number;
  posterUrl: string;
  rating: string;
  releaseDate: string;
  createdAt: string;
}

export interface Theatre {
  id: string;
  name: string;
  city: string;
  address: string;
  pincode: string;
}

export interface Screen {
  id: string;
  theatreId: string;
  name: string;
  screenType: string;
  totalRows: number;
  totalColumns: number;
}

export interface Show {
  id: string;
  movieId: string;
  screenId: string;
  showTime: string;
  priceMultiplier: number;
  status: string;
  createdAt: string;
}

export interface SeatAvailability {
  seatId: string | null;
  columnNumber: number;
  seatLabel: string;
  gap: boolean;
  blocked: boolean;
  status: "AVAILABLE" | "PENDING" | "BOOKED" | "BLOCKED" | null;
}

export interface RowAvailability {
  label: string;
  seats: SeatAvailability[];
}

export interface SectionAvailability {
  sectionName: string;
  seatType: string;
  basePrice: number;
  finalPrice: number;
  rows: RowAvailability[];
}

export interface SeatAvailabilityResponse {
  showId: string;
  sections: SectionAvailability[];
}

export interface BookedSeat {
  seatId: string;
  rowLabel: string;
  columnNumber: number;
  seatType: string;
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  showId: string;
  seats: BookedSeat[];
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  bookedAt: string;
  expiresAt: string;
}

export interface User {
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
}

export interface ErrorResponse {
  status: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
}

export interface ShowSummary {
  showId: string;
  showTime: string;
  priceMultiplier: number;
  status: string;
}

export interface ScreenShows {
  screenId: string;
  screenName: string;
  screenType: string;
  shows: ShowSummary[];
}

export interface ShowsByTheatre {
  theatreId: string;
  theatreName: string;
  theatreAddress: string;
  screens: ScreenShows[];
}
