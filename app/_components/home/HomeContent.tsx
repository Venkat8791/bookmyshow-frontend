import { useLocation } from "@/app/context/LocationContext";
import { movieService } from "@/app/services/movieService";
import { Movie } from "@/app/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import MovieCard from "../movies/MovieCard";

export default function HomeContent() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { city } = useLocation();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  useEffect(() => {
    if (search) {
      fetchBySearch(search);
    } else {
      fetchByCity();
    }
  }, [city, search]);

  const fetchByCity = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await movieService.getAll(city);
      setMovies(response.data);
    } catch (err) {
      setError("Failed to load movies.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBySearch = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await movieService.search(query);
      setMovies(response.data);
    } catch (err) {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" />
      </div>
    );

  if (error)
    return <div className="text-center text-red-400 py-12">{error}</div>;

  return (
    <div>
      {/* Hero */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-white mb-2">
          Book Movie Tickets
        </h1>
        {search ? (
          <p className="text-gray-400 mt-2">
            Search results for{" "}
            <span className="text-red-400 font-medium">{search}</span>
          </p>
        ) : (
          <p className="text-gray-400 mt-2">
            Showing movies in{" "}
            <span className="text-red-400 font-medium">{city}</span>
          </p>
        )}
      </div>

      {/* Movie grid */}
      {movies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">
            {search
              ? `No movies found for "${search}"`
              : `No movies playing in ${city}`}
          </p>
          <p className="text-gray-600 text-sm mt-2">
            {search
              ? "Try a different search term"
              : "Try selecting a different city"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
