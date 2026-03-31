import Image from "next/image";
import { Movie, Show } from "@/app/types";

export default function MovieInfo({
  movie,
  show,
}: {
  movie: Movie;
  show: Show;
}) {
  return (
    <div className="flex gap-4 w-full bg-gray-800/50 border border-gray-700 rounded-2xl p-4 mb-6">
      {/* poster */}
      <div className="relative shrink-0 w-16 h-24 bg-gray-800 rounded-xl overflow-hidden">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            🎬
          </div>
        )}
      </div>

      {/* details */}
      <div className="flex flex-col justify-center gap-1">
        <h2 className="text-white font-semibold text-base leading-tight">
          {movie.title}
        </h2>
        <p className="text-gray-400 text-xs">
          {movie.language} • {movie.durationMinutes} mins
        </p>
        {movie.genre && <p className="text-gray-500 text-xs">{movie.genre}</p>}
        <p className="text-gray-300 text-xs mt-1">
          🕐{" "}
          {new Date(show.showTime).toLocaleString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
      </div>
    </div>
  );
}
