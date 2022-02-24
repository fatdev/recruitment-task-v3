import { Movie } from "./movie.interface";
import { MoviesRepository } from "./movies.repository";

export type MoviesFetchConditions = {
  duration?: number;
  genres?: string[];
};

export class MoviesService {
  moviesRepository: MoviesRepository;

  constructor(moviesRepository: MoviesRepository) {
    this.moviesRepository = moviesRepository;
  }

  async fetch(conditions?: MoviesFetchConditions) {
    if (
      conditions &&
      Object.keys(conditions).length === 1 &&
      conditions.duration !== undefined
    ) {
      return this.moviesRepository.fetchByDuration(conditions.duration);
    }
    if (conditions && conditions.genres !== undefined) {
      return this.moviesRepository.fetchByGenres(
        conditions.genres,
        conditions.duration
      );
    }
    return this.moviesRepository.fetchRandom();
  }

  async save(movie: Movie) {
    return this.moviesRepository.save(movie);
  }
}
