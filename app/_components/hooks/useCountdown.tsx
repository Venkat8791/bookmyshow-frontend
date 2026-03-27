// ── Countdown timer hook ──────────────────────────────────────────────────────

import { useEffect, useState } from "react";

export default function useCountdown(expiresAt: string | null) {
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  useEffect(() => {
    if (!expiresAt) return;

    const calc = () => {
      const diff = Math.max(
        0,
        Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000),
      );
      setSecondsLeft(diff);
      return diff;
    };

    calc();
    const interval = setInterval(() => {
      const remaining = calc();
      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");
  const isExpired = secondsLeft === 0;
  const isUrgent = secondsLeft <= 60 && secondsLeft > 0;

  return { mins, secs, isExpired, isUrgent, secondsLeft };
}
