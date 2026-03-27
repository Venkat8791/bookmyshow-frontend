"use client";

import { useEffect, useRef, useCallback } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────
const SEAT_SIZE = 28;
const SEAT_GAP = 6;
const ROW_LABEL_WIDTH = 24;
const PADDING = 20;
const SECTION_LABEL_HEIGHT = 28;
const SECTION_GAP = 16;
const MIN_SCALE = 1;
const MAX_SCALE = 3;

// ── Colors ────────────────────────────────────────────────────────────────────
const SEAT_COLORS = {
  AVAILABLE: {
    fill: "transparent",
    text: "#4ade80",
    stroke: "#16a34a",
    lineWidth: 1.5,
  },
  SELECTED: {
    fill: "#16a34a",
    text: "#f0fdf4",
    stroke: "#4ade80",
    lineWidth: 1.5,
  },
  TAKEN: {
    fill: "#374151",
    text: "#6b7280",
    stroke: "#4b5563",
    lineWidth: 1,
  },
  BLOCKED: {
    fill: "#111827",
    text: "#1f2937",
    stroke: "#1f2937",
    lineWidth: 0.5,
  },
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface CanvasSeat {
  seatId: string | null;
  columnNumber: number;
  seatLabel?: string | null;
  isGap: boolean;
  isBlocked: boolean;
  status: "AVAILABLE" | "PENDING" | "BOOKED" | null;
}

interface CanvasRow {
  label: string;
  seats: CanvasSeat[];
}

interface CanvasSection {
  sectionName: string;
  seatType: string;
  finalPrice: number;
  rows: CanvasRow[];
}

interface SeatCanvasProps {
  sections: CanvasSection[];
  selectedSeats: Set<string>;
  onSeatClick: (seatId: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SeatCanvas({
  sections,
  selectedSeats,
  onSeatClick,
}: SeatCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // zoom + pan state — refs to avoid re-renders
  const scale = useRef(1);
  const offsetX = useRef(0);
  const offsetY = useRef(0);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // ── Canvas content dimensions ──────────────────────────────────────────────
  const allRows = sections.flatMap((s) => s.rows);
  const maxColumns = Math.max(...allRows.map((r) => r.seats.length), 1);
  const canvasWidth =
    PADDING + ROW_LABEL_WIDTH + maxColumns * (SEAT_SIZE + SEAT_GAP) + PADDING;
  const canvasHeight =
    PADDING +
    sections.reduce(
      (acc, section) =>
        acc +
        SECTION_LABEL_HEIGHT +
        section.rows.length * (SEAT_SIZE + SEAT_GAP) +
        SECTION_GAP,
      0,
    ) +
    PADDING;

  // ── Draw function ─────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(
      scale.current * dpr,
      0,
      0,
      scale.current * dpr,
      offsetX.current * dpr,
      offsetY.current * dpr,
    );

    let currentY = PADDING;

    sections.forEach((section) => {
      // ── section label + separator lines ──────────────────────────────
      const lineY = currentY + SECTION_LABEL_HEIGHT / 2;

      ctx.beginPath();
      ctx.moveTo(PADDING, lineY);
      ctx.lineTo(PADDING + ROW_LABEL_WIDTH + 8, lineY);
      ctx.strokeStyle = "#374151";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      const labelText = `${section.sectionName}  ₹${section.finalPrice}`;
      ctx.fillStyle = "#9ca3af";
      ctx.font = "10px monospace";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(labelText, PADDING + ROW_LABEL_WIDTH + 14, lineY);

      const textWidth = ctx.measureText(labelText).width;
      ctx.beginPath();
      ctx.moveTo(PADDING + ROW_LABEL_WIDTH + 20 + textWidth, lineY);
      ctx.lineTo(canvasWidth - PADDING, lineY);
      ctx.strokeStyle = "#374151";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      currentY += SECTION_LABEL_HEIGHT;

      // ── rows ──────────────────────────────────────────────────────────
      section.rows.forEach((row) => {
        const y = currentY;

        ctx.fillStyle = "#6b7280";
        ctx.font = "11px monospace";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(
          row.label,
          PADDING + ROW_LABEL_WIDTH - 4,
          y + SEAT_SIZE / 2,
        );

        row.seats.forEach((seat, colIndex) => {
          const x =
            PADDING + ROW_LABEL_WIDTH + colIndex * (SEAT_SIZE + SEAT_GAP);
          if (seat.isGap) return;

          const colors = seat.isBlocked
            ? SEAT_COLORS.BLOCKED
            : seat.status === "BOOKED" || seat.status === "PENDING"
              ? SEAT_COLORS.TAKEN
              : selectedSeats.has(seat.seatId ?? "")
                ? SEAT_COLORS.SELECTED
                : SEAT_COLORS.AVAILABLE;

          ctx.beginPath();
          ctx.roundRect(x, y, SEAT_SIZE, SEAT_SIZE, 4);
          ctx.fillStyle = colors.fill;
          ctx.fill();

          ctx.beginPath();
          ctx.roundRect(x, y, SEAT_SIZE, SEAT_SIZE, 4);
          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = colors.lineWidth;
          ctx.stroke();

          if (!seat.isBlocked) {
            ctx.fillStyle = colors.text;
            ctx.font = "9px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(
              seat.seatLabel?.substring(1) ?? "",
              x + SEAT_SIZE / 2,
              y + SEAT_SIZE / 2,
            );
          }
        });

        currentY += SEAT_SIZE + SEAT_GAP;
      });

      currentY += SECTION_GAP;
    });
  }, [sections, selectedSeats, canvasWidth]);

  // ── Center content at scale=1 ─────────────────────────────────────────────
  const centerContent = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    scale.current = 1;
    offsetX.current = Math.max(
      PADDING,
      (container.clientWidth - canvasWidth) / 2,
    );
    offsetY.current = Math.max(
      PADDING,
      (container.clientHeight - canvasHeight) / 2,
    );
  }, [canvasWidth, canvasHeight]);

  // ── Setup canvas to fill the viewport container ────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const w = container.clientWidth;
    const h = container.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    centerContent();
    draw();
  }, [draw, centerContent]);

  // ── Non-passive wheel listener ─────────────────────────────────────────────
  // React's onWheel is passive — e.preventDefault() is silently ignored, so
  // the page scrolls AND the canvas transforms, making it fly off screen.
  // Attaching directly with { passive: false } fixes this.
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // exponential zoom — smooth regardless of deltaY magnitude
      const zoomFactor = Math.exp(-e.deltaY * 0.002);
      const newScale = Math.min(
        Math.max(scale.current * zoomFactor, MIN_SCALE),
        MAX_SCALE,
      );

      offsetX.current =
        mouseX - (mouseX - offsetX.current) * (newScale / scale.current);
      offsetY.current =
        mouseY - (mouseY - offsetY.current) * (newScale / scale.current);
      scale.current = newScale;

      draw();
    };

    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [draw]);

  // ── Convert screen → canvas logical coordinates ───────────────────────────
  const toCanvasCoords = (screenX: number, screenY: number) => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    const rect = container.getBoundingClientRect();
    return {
      x: (screenX - rect.left - offsetX.current) / scale.current,
      y: (screenY - rect.top - offsetY.current) / scale.current,
    };
  };

  // ── Hit-test seat from logical coordinates ────────────────────────────────
  const getSeatFromPosition = (
    mouseX: number,
    mouseY: number,
  ): CanvasSeat | null => {
    let currentY = PADDING;

    for (const section of sections) {
      currentY += SECTION_LABEL_HEIGHT;

      for (const row of section.rows) {
        if (mouseY >= currentY && mouseY <= currentY + SEAT_SIZE) {
          const colIndex = Math.floor(
            (mouseX - PADDING - ROW_LABEL_WIDTH) / (SEAT_SIZE + SEAT_GAP),
          );
          if (colIndex >= 0 && colIndex < row.seats.length) {
            return row.seats[colIndex];
          }
        }
        currentY += SEAT_SIZE + SEAT_GAP;
      }

      currentY += SECTION_GAP;
    }

    return null;
  };

  // ── Pan ───────────────────────────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = false;
    isPanning.current = true;
    panStart.current = {
      x: e.clientX - offsetX.current,
      y: e.clientY - offsetY.current,
    };
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.style.cursor = "grabbing";
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isPanning.current = false;
    e.currentTarget.style.cursor = "grab";
  };

  const handleMouseLeave = () => {
    isPanning.current = false;
  };

  // ── Mouse move — pan + cursor ─────────────────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    if (Math.sqrt(dx * dx + dy * dy) > 3) {
      isDragging.current = true;
    }

    if (isPanning.current && isDragging.current) {
      offsetX.current = e.clientX - panStart.current.x;
      offsetY.current = e.clientY - panStart.current.y;
      canvas.style.cursor = "grabbing";
      draw();
      return;
    }

    const { x, y } = toCanvasCoords(e.clientX, e.clientY);
    const seat = getSeatFromPosition(x, y);
    if (
      seat &&
      !seat.isGap &&
      !seat.isBlocked &&
      seat.status !== "BOOKED" &&
      seat.status !== "PENDING" &&
      seat.seatId
    ) {
      canvas.style.cursor = "pointer";
    } else {
      canvas.style.cursor = isPanning.current ? "grabbing" : "grab";
    }
  };

  // ── Click — seat selection ────────────────────────────────────────────────
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging.current) {
      isDragging.current = false;
      return;
    }

    const { x, y } = toCanvasCoords(e.clientX, e.clientY);
    const seat = getSeatFromPosition(x, y);

    if (!seat || seat.isGap || seat.isBlocked) return;
    if (seat.status === "BOOKED" || seat.status === "PENDING") return;
    if (!seat.seatId) return;

    onSeatClick(seat.seatId);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-grab"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
}
