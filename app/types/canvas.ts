// ── Types ─────────────────────────────────────────────────────────────────────
export interface CanvasSeat {
  seatId: string | null;
  columnNumber: number;
  seatLabel?: string | null;
  isGap: boolean;
  isBlocked: boolean;
  status: "AVAILABLE" | "PENDING" | "BOOKED" | null;
}

export interface CanvasSection {
  sectionName: string;
  seatType: string;
  finalPrice: number;
  rows: { label: string; seats: CanvasSeat[] }[];
}
