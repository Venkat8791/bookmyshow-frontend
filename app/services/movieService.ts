import { Movie } from "../types";
import api from "./api";
import { AxiosResponse } from "axios";

export const movieService = {
  getAll: (city?: string): Promise<AxiosResponse<Movie[]>> =>
    api.get(`/movies${city ? `?city=${encodeURIComponent(city)}` : ""}`),

  getById: (id: string): Promise<AxiosResponse<Movie>> =>
    api.get(`/movies/${id}`),

  search: (title: string): Promise<AxiosResponse<Movie[]>> =>
    api.get(`/movies?title=${encodeURIComponent(title)}`),

  getByLanguage: (language: string): Promise<AxiosResponse<Movie[]>> =>
    api.get(`/movies?language=${encodeURIComponent(language)}`),

  getByGenre: (genre: string): Promise<AxiosResponse<Movie[]>> =>
    api.get(`/movies?genre=${encodeURIComponent(genre)}`),
};
