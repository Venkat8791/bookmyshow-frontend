import DateSelector from "@/app/_components/shows/DateSelector";
import TheatreShowsCard from "@/app/_components/shows/TheatreShowCard";
import LoadingSpinner from "@/app/_components/common/LoadingSpinner";
import { ShowsByTheatre } from "@/app/types";

interface ShowsSectionProps {
  city: string;
  dates: Date[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  showsLoading: boolean;
  theatreShows: ShowsByTheatre[];
  onShowSelect: (showId: string) => void;
}

export default function ShowsSection({
  city,
  dates,
  selectedDate,
  onDateSelect,
  showsLoading,
  theatreShows,
  onShowSelect,
}: ShowsSectionProps) {
  return (
    <div className="border-t border-gray-800 pt-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-semibold text-lg">
          Shows in <span className="text-red-400">{city}</span>
        </h2>
      </div>

      <div className="mb-6">
        <DateSelector
          dates={dates}
          selectedDate={selectedDate}
          onSelect={onDateSelect}
        />
      </div>

      {showsLoading ? (
        <LoadingSpinner />
      ) : theatreShows.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">
            No shows available in {city} on this date
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Try selecting a different date or city
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {theatreShows.map((theatre) => (
            <TheatreShowsCard
              key={theatre.theatreId}
              theatre={theatre}
              onShowSelect={onShowSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
