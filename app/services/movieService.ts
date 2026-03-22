import api from "./api";
import { AxiosResponse } from "axios";
import { Movie } from "../types";

export const movieService = {
  getAll: (): Promise<AxiosResponse<Movie[]>> => api.get("/movies"),
  getById: (id: string): Promise<AxiosResponse<Movie>> =>
    api.get(`/movies/${id}`),
  search: (title: string): Promise<AxiosResponse<Movie[]>> =>
    api.get(`/movies/search?title=${title}`),
  getByLanguage: (language: string): Promise<AxiosResponse<Movie[]>> =>
    api.get(`/movies/language/${language}`),
  getByGenre: (genre: string): Promise<AxiosResponse<Movie[]>> =>
    api.get(`/movies/genre/${genre}`),
};
