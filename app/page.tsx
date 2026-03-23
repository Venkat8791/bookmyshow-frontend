"use client";

import { useState, useEffect } from "react";
import { Movie } from "./types";
import { movieService } from "./services/movieService";
import MovieSearch from "./_components/movies/MovieSearch";
import MovieCard from "./_components/movies/MovieCard";

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await movieService.getAll();
      setMovies(response.data);
    } catch (err) {
      setError("Failed to load movies. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      fetchMovies();
      return;
    }
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
        <p className="text-gray-400 mt-2">
          Find and book tickets for the latest movies
        </p>
      </div>

      {/* Movie grid */}
      {movies.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No movies found</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
