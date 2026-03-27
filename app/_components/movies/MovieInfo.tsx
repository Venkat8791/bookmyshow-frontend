import { Movie } from "@/app/types";
import Image from "next/image";

interface MovieInfoProps {
  movie: Movie;
}

export default function MovieInfo({ movie }: MovieInfoProps) {
  return (
    <div className="flex gap-6 mb-10">
      {/* Poster */}
      <div className="relative flex-shrink-0 w-36 h-52 md:w-48 md:h-72 bg-gray-800 rounded-xl overflow-hidden">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🎬
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {movie.rating && (
            <span className="bg-gray-700 text-gray-300 text-xs px-2.5 py-1 rounded-full">
              {movie.rating}
            </span>
          )}
          {movie.language && (
            <span className="text-gray-400 text-sm">{movie.language}</span>
          )}
          <span className="text-gray-600">•</span>
          <span className="text-gray-400 text-sm">
            {movie.durationMinutes} mins
          </span>
          {movie.genre && (
            <>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400 text-sm">{movie.genre}</span>
            </>
          )}
        </div>
        {movie.releaseDate && (
          <p className="text-gray-500 text-sm mb-4">
            Released:{" "}
            {new Date(movie.releaseDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
        {movie.description && (
          <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
            {movie.description}
          </p>
        )}
      </div>
    </div>
  );
}
