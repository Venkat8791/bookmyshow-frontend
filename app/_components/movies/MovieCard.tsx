import { Movie } from "@/app/types";
import Image from "next/image";
import Link from "next/link";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer">
        <div className="relative h-72 bg-gray-800">
          {movie.posterUrl ? (
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl">🎬</span>
            </div>
          )}
          <span className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {movie.rating || "U"}
          </span>
        </div>
        <div className="p-3">
          <h3 className="text-white font-semibold text-sm truncate">
            {movie.title}
          </h3>
          <p className="text-gray-400 text-xs mt-1">
            {movie.genre} • {movie.language}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            {movie.durationMinutes} mins
          </p>
        </div>
      </div>
    </Link>
  );
}
