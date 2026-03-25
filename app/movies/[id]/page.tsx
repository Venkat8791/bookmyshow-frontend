"use client";

import ErrorAlert from "@/app/_components/common/ErrorAlert";
import LoadingSpinner from "@/app/_components/common/LoadingSpinner";
import DateSelector from "@/app/_components/shows/DateSelector";
import { formatDate } from "@/app/_components/shows/DateUtils";
import TheatreShowsCard from "@/app/_components/shows/TheatreShowCard";
import { useLocation } from "@/app/context/LocationContext";
import { movieService } from "@/app/services/movieService";
import { showService } from "@/app/services/showService";
import { Movie, ShowsByTheatre } from "@/app/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function getNext5Days() {
  return Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });
}

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { city } = useLocation();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [theatreShows, setTheatreShows] = useState<ShowsByTheatre[]>([]);
  const [movieLoading, setMovieLoading] = useState(true);
  const [showsLoading, setShowsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dates = getNext5Days();
  const [selectedDate, setSelectedDate] = useState<string>(
    formatDate(dates[0]),
  );

  //fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setMovieLoading(true);
        const response = await movieService.getById(id);
        setMovie(response.data);
      } catch (err: any) {
        setError("Movie not found");
      } finally {
        setMovieLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  // fetch shows by city + date
  useEffect(() => {
    const fetchShows = async () => {
      try {
        setShowsLoading(true);
        const response = await showService.getShowsByMovieAndCity(
          id,
          city,
          selectedDate,
        );
        setTheatreShows(response.data);
      } catch (err: any) {
        setTheatreShows([]);
      } finally {
        setShowsLoading(false);
      }
    };
    fetchShows();
  }, [id, city, selectedDate]);

  const handleShowSelect = (showId: string) => {
    router.push(`/shows/${showId}/seats`);
  };

  if (movieLoading) {
    return <LoadingSpinner />;
  }

  if (error || !movie) {
    return <ErrorAlert message={error || "Movie not found"} />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Movie info */}
      <div className="flex gap-6 mb-10">
        {/* Poster */}
        <div className="flex-shrink-0 w-36 h-52 md:w-48 md:h-72 bg-gray-800 rounded-xl overflow-hidden">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
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

      {/* Shows section */}
      <div className="border-t border-gray-800 pt-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-lg">
            Shows in <span className="text-red-400">{city}</span>
          </h2>
        </div>

        {/* Date selector */}
        <div className="mb-6">
          <DateSelector
            dates={dates}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />
        </div>

        {/* Theatre shows */}
        {showsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500" />
          </div>
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
                onShowSelect={handleShowSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
