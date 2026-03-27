import ShowTimePill from "@/app/_components/shows/ShowTimePill";
import { Show } from "@/app/types";
import Button from "../common/Button";

interface SeatLayoutHeaderProps {
  show: Show;
  siblingShows: Show[];
  showId: string;
  onBack: () => void;
  onShowSelect: (showId: string) => void;
}

function formatTime(isoString: string) {
  return new Date(isoString).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function SeatLayoutHeader({
  show,
  siblingShows,
  showId,
  onBack,
  onShowSelect,
}: SeatLayoutHeaderProps) {
  return (
    <div className="shrink-0 px-6 py-3 border-b border-gray-800 bg-gray-900">
      <div className="flex flex-col min-[321px]:flex-row min-[321px]:items-center min-[321px]:justify-between gap-2">
        {/* back button + show info */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onBack}
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
          </Button>
          <div>
            <h1 className="text-white font-semibold text-base leading-tight">
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
                  onClick={() => onShowSelect(s.id)}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
