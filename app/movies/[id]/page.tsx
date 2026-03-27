"use client";

import { formatDate } from "@/app/utils/dateUtils";
import { useLocation } from "@/app/context/LocationContext";
import { movieService } from "@/app/services/movieService";
import { showService } from "@/app/services/showService";
import { Movie, ShowsByTheatre } from "@/app/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ErrorAlert from "@/app/_components/common/ErrorAlert";
import LoadingSpinner from "@/app/_components/common/LoadingSpinner";
import MovieInfo from "@/app/_components/movies/MovieInfo";
import ShowsSection from "@/app/_components/movies/ShowsSection";

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
      <MovieInfo movie={movie} />
      <ShowsSection
        city={city}
        dates={dates}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        showsLoading={showsLoading}
        theatreShows={theatreShows}
        onShowSelect={handleShowSelect}
      />
    </div>
  );
}
