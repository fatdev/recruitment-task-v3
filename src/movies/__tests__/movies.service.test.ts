import { Movie } from "../movie.interface";
import { MoviesRepository } from "../movies.repository";
import { MoviesService } from "../movies.service";

describe("Movies service", () => {
  describe("fetch", () => {
    const expected = [
      {
        id: 2,
      },
    ];

    test("should call fetchRandom when no condition given", async () => {
      const moviesRepository = {
        fetchRandom: async () => {
          return expected;
        },
      } as MoviesRepository;
      const moviesService = new MoviesService(moviesRepository);
      const actual = await moviesService.fetch();
      expect(actual).toEqual(expected);
    });

    test("should call fetchByDuration when duration given", async () => {
      const moviesRepository = {
        fetchByDuration: async (_) => {
          return expected;
        },
      } as MoviesRepository;
      const moviesService = new MoviesService(moviesRepository);
      const duration = 100;
      const actual = await moviesService.fetch({
        duration,
      });
      expect(actual).toEqual(expected);
    });

    test("should call fetchByGenres when genres given", async () => {
      let actualGenres;
      let actualDuration;
      const moviesRepository = {
        fetchByGenres: async (genres: string[], duration: number) => {
          actualGenres = genres;
          actualDuration = duration;
          return expected;
        },
      } as MoviesRepository;

      const genres = ["Comedy", "Adventure"];
      const moviesService = new MoviesService(moviesRepository);
      const actual = await moviesService.fetch({
        genres,
      });
      expect(actual).toEqual(expected);
      expect(actualGenres).toEqual(genres);
      expect(actualDuration).toBeUndefined();
    });

    test("should call fetchByGenres when genres and duration given", async () => {
      let actualGenres;
      let actualDuration;
      const moviesRepository = {
        fetchByGenres: async (genres: string[], duration: number) => {
          actualGenres = genres;
          actualDuration = duration;
          return expected;
        },
      } as MoviesRepository;
      const duration = 100;
      const genres = ["Comedy", "Adventure"];
      const moviesService = new MoviesService(moviesRepository);
      const actual = await moviesService.fetch({
        genres,
        duration,
      });
      expect(actual).toEqual(expected);
      expect(actualGenres).toEqual(genres);
      expect(actualDuration).toEqual(duration);
    });
  });
  describe("create", () => {
    test("should call save", async () => {
      const id = 3;
      const moviesRepository = {
        save: async (movie: Movie) => {
          return {
            ...movie,
            id,
          };
        },
      } as MoviesRepository;
      const moviesService = new MoviesService(moviesRepository);
      const given = {
        title: "fake",
      } as Movie;
      const actual = await moviesService.save(given);
      expect(actual).toEqual({
        ...given,
        id,
      });
    });
  });
});
