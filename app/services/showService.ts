import { SeatAvailabilityResponse, Show } from "../types";
import api from "./api";
import { AxiosResponse } from "axios";

export const showService = {
  getByMovie: (movieId: string): Promise<AxiosResponse<Show[]>> =>
    api.get(`/shows?movieId=${movieId}`),

  getById: (id: string): Promise<AxiosResponse<Show>> =>
    api.get(`/shows/${id}`),

  getSeatAvailability: (
    showId: string,
  ): Promise<AxiosResponse<SeatAvailabilityResponse>> =>
    api.get(`/shows/${showId}/seats`),
};
