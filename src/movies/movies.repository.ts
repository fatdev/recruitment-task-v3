import { Movie } from "./movie.interface";
import { DataService } from "../data/data.service";
import HttpException from "../exception/http.exception";

export class MoviesRepository {
  dataService: DataService;

  constructor(dataService: DataService) {
    this.dataService = dataService;
  }

  async fetchRandom(): Promise<Movie[]> {
    const movies = await this.readMovies();
    return [this.random(movies)];
  }

  async fetchByDuration(duration: number): Promise<Movie[]> {
    const movies = await this.readMovies();
    const filtered = movies.filter(this.byDuration(duration));
    return [this.random(filtered)];
  }

  async fetchByGenres(genres: string[], duration?: number) {
    const compareByGenresOccur = (a: Movie, b: Movie) => {
      const aOccurNumber = a.genres.filter((genre) =>
        genres.includes(genre)
      ).length;
      const bOccurNumber = b.genres.filter((genre) =>
        genres.includes(genre)
      ).length;
      if (aOccurNumber > bOccurNumber) {
        return -1;
      }
      if (aOccurNumber < bOccurNumber) {
        return 1;
      }
      return 0;
    };

    const byGenres = (movie: Movie) => {
      return genres.some((genre) => movie.genres.includes(genre));
    };
    const { movies } = await this.dataService.readData();
    if (duration !== undefined) {
      return movies
        .filter(byGenres)
        .filter(this.byDuration(duration))
        .sort(compareByGenresOccur);
    }
    return movies.filter(byGenres).sort(compareByGenresOccur);
  }

  async save(movie: Movie): Promise<Movie> {
    const data = await this.dataService.readData();
    if (
      movie.genres.filter((genre) => !data.genres.includes(genre)).length > 0
    ) {
      throw new HttpException(
        400,
        `genres must be one of ${data.genres.join(", ")}`
      );
    }
    const id = data.movies[data.movies.length - 1].id + 1;
    const newMovie = {
      ...movie,
      id,
    };
    data.movies.push(newMovie);
    await this.dataService.saveData(data);
    return newMovie;
  }

  private byDuration = (duration: number) => {
    return function (movie: Movie) {
      return (
        Number(movie.runtime) >= duration - 10 &&
        Number(movie.runtime) <= duration + 10
      );
    };
  };

  private async readMovies(): Promise<Movie[]> {
    const { movies } = await this.dataService.readData();
    return movies;
  }

  private random(movies: Movie[]): Movie {
    return movies[Math.floor(Math.random() * movies.length)];
  }
}
