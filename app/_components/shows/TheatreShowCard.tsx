import { ShowsByTheatre } from "@/app/types";
import ShowTimeButton from "./ShowTimeButton";

export default function TheatreShowsCard({
  theatre,
  onShowSelect,
}: {
  theatre: ShowsByTheatre;
  onShowSelect: (showId: string) => void;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      {/* Theatre info */}
      <div className="mb-4">
        <h3 className="text-white font-semibold text-lg">
          {theatre.theatreName}
        </h3>
        {theatre.theatreAddress && (
          <p className="text-gray-500 text-sm mt-0.5">
            {theatre.theatreAddress}
          </p>
        )}
      </div>

      {/* Screens */}
      <div className="space-y-4">
        {theatre.screens.map((screen) => (
          <div key={screen.screenId}>
            {/* Show times */}
            <div className="flex flex-wrap gap-2">
              {screen.shows.map((show) => (
                <ShowTimeButton
                  key={show.showId}
                  show={show}
                  screenType={screen.screenType}
                  onClick={() => onShowSelect(show.showId)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
