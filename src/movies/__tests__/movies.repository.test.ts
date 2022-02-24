import { Data } from "../../data/data.interface";
import { DataService } from "../../data/data.service";
import HttpException from "../../exception/http.exception";
import { Movie } from "../movie.interface";
import { MoviesRepository } from "../movies.repository";

describe("Movies repository", () => {
  describe("fetchRandom", () => {
    const data: Partial<Data> = {
      movies: [{ id: 1 } as Movie, { id: 2 } as Movie],
    };
    test("should return random movie", async () => {
      const dataService = {
        readData: async () => {
          return data;
        },
      } as DataService;
      const moviesRepository = new MoviesRepository(dataService);
      const actual = await moviesRepository.fetchRandom();
      expect(data.movies).toEqual(expect.arrayContaining(actual));
    });
  });

  describe("fetchByDuration", () => {
    test("should return random movie by duration", async () => {
      const duration = 100;
      const matchingMovies = [
        {
          id: 1,
          runtime: "90",
        } as Movie,
        {
          id: 2,
          runtime: "110",
        } as Movie,
        {
          id: 3,
          runtime: "100",
        } as Movie,
      ];
      const notMatchingMovies = [
        {
          id: 4,
          runtime: "80",
        } as Movie,
        {
          id: 5,
          runtime: "111",
        } as Movie,
      ];
      const data = {
        movies: [...matchingMovies, ...notMatchingMovies],
      };
      const dataService = {
        readData: async () => {
          return data;
        },
      } as DataService;
      const moviesRepository = new MoviesRepository(dataService);
      const actual = await moviesRepository.fetchByDuration(duration);
      expect(matchingMovies).toEqual(expect.arrayContaining(actual));
    });
  });

  describe("fetchByGenres", () => {
    test("should return movies filtered and sorted by genres", async () => {
      const movies = [
        {
          id: 1,
          genres: ["A", "D"],
        },
        {
          id: 2,
          genres: ["A", "B", "C", "D"],
        },
        {
          id: 3,
          genres: ["D"],
        },
        {
          id: 4,
          genres: ["A", "B"],
        },
      ];
      const dataService = {
        readData: async () => {
          return {
            movies,
          };
        },
      } as DataService;
      const moviesRepository = new MoviesRepository(dataService);
      const actual = await moviesRepository.fetchByGenres(["A", "B", "C"]);
      expect(actual).toEqual([movies[1], movies[3], movies[0]]);
    });
    test("should return movies filtered by genres and duration and sorted by genres", async () => {
      const movies = [
        {
          id: 1,
          genres: ["A", "D"],
          runtime: "100",
        },
        {
          id: 2,
          genres: ["A", "B", "C", "D"],
          runtime: "80",
        },
        {
          id: 3,
          genres: ["D"],
        },
        {
          id: 4,
          genres: ["A", "B"],
          runtime: "110",
        },
      ];
      const dataService = {
        readData: async () => {
          return {
            movies,
          };
        },
      } as DataService;
      const moviesRepository = new MoviesRepository(dataService);
      const actual = await moviesRepository.fetchByGenres(["A", "B", "C"], 100);
      expect(actual).toEqual([movies[3], movies[0]]);
    });
  });

  describe("save", () => {
    const stubData = {
      genres: ["a", "b"],
      movies: [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ],
    };
    test("should call saveData and return saved object with new id", async () => {
      const given = {
        title: "new",
        genres: [stubData.genres[1]],
      } as Movie;
      const expected = {
        ...given,
        id: 3,
      } as Movie;
      const expectedData = {
        genres: stubData.genres,
        movies: [...stubData.movies, expected],
      };

      const dataService = {
        readData: jest.fn().mockResolvedValue(stubData),
        saveData: jest.fn().mockResolvedValue({}),
      };
      const moviesRepository = new MoviesRepository(
        dataService as unknown as DataService
      );
      const actual = await moviesRepository.save(given);
      expect(actual).toEqual(expected);
      expect(dataService.saveData).toHaveBeenCalledWith(expectedData);
    });

    test("should throw HttpException when genres invalid", async () => {
      const given = {
        title: "new",
        genres: ["fake"],
      } as Movie;

      const dataService = {
        readData: jest.fn().mockResolvedValue(stubData),
        saveData: jest.fn().mockResolvedValue({}),
      };
      const moviesRepository = new MoviesRepository(
        dataService as unknown as DataService
      );
      try {
        await moviesRepository.save(given);
        expect(true).toBe(false);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect((e as HttpException).statusCode).toEqual(400);
        expect(dataService.saveData).toBeCalledTimes(0);
      }
    });
  });
});
