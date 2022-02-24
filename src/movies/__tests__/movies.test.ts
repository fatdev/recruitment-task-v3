import request from "supertest";
import { promises as fs } from "fs";
import path from "path";
import App from "../../app";
import { DataService } from "../../data/data.service";
import { MoviesController } from "../movies.controller";
import { MoviesRepository } from "../movies.repository";
import { MoviesService } from "../movies.service";
import { Data } from "../../data/data.interface";
import { Movie } from "../movie.interface";
import { MovieDTO } from "../movie.dto";

describe("Movies router", () => {
  const getController = (path: string) => {
    const moviesService = new MoviesService(
      new MoviesRepository(
        new DataService({
          path,
        })
      )
    );
    return new MoviesController(moviesService);
  };

  afterAll(async () => {
    const deleteTestData = async () => {
      const files = await fs.readdir(path.resolve(__dirname));
      for (const file of files) {
        if (file.endsWith("data.json")) {
          await fs.unlink(path.resolve(__dirname, file));
        }
      }
    };
    await deleteTestData();
  });

  const saveTestData = async (data: Data, name?: string) => {
    const dataPath = path.resolve(__dirname, `movies.${name || ""}.data.json`);
    await fs.writeFile(dataPath, JSON.stringify(data));
    return dataPath;
  };
  describe("/ GET", () => {
    test("should response with random movie", async () => {
      // If we don't provide any parameter, then it should return a single random movie.

      const data = {
        movies: [
          {
            id: 1,
          },
          {
            id: 2,
          },
        ] as Partial<Movie>[],
      } as Data;
      const dataPath = await saveTestData(data);

      const app = new App([getController(dataPath)]);
      const res = await request(app.getServer()).get("/movies");
      expect(res.statusCode).toEqual(200);
      expect(data.movies).toEqual(expect.arrayContaining(res.body));
    });

    test("response with movies by duration ", async () => {
      // If we provide only duration parameter,
      // then it should return a single random movie
      // that has a runtime between <duration - 10> and <duration + 10

      const duration = 100;
      const matchingMovies = [
        {
          id: 1,
          runtime: "100",
        } as Movie,
      ];
      const notMatchingMovies = [
        {
          id: 4,
          runtime: "80",
        } as Movie,
      ];
      const data: Partial<Data> = {
        movies: [...matchingMovies, ...notMatchingMovies],
      };

      const dataPath = await saveTestData(data as Data, "duration");

      const app = new App([getController(dataPath)]);
      const res = await request(app.getServer()).get(
        `/movies?duration=${duration}`
      );
      expect(res.statusCode).toEqual(200);
      expect(matchingMovies).toEqual(expect.arrayContaining(res.body));
    });

    test("response with movies by genres", async () => {
      // If we provide only genres parameter,
      // then it should return all movies that contain at least one of the specified genres.
      // Also movies should be ordered by a number of genres that match.
      // For example if we send a request with genres [Comedy, Fantasy, Crime]
      // then the top hits should be movies that have all three of them,
      // then there should be movies that have one of [Comedy, Fantasy], [comedy, crime], [Fantasy, Crime]
      // and then those with Comedy only, Fantasy only and Crime only.

      const genres = ["A", "B"];
      const data = {
        movies: [
          {
            id: 1,
            genres: ["A"],
          },
          {
            id: 2,
            genres: ["A", "B"],
          },
          {
            id: 3,
            genres: ["C"],
          },
        ] as Partial<Movie>[],
      } as Data;
      const dataPath = await saveTestData(data, "genres");
      const app = new App([getController(dataPath)]);
      const res = await request(app.getServer()).get(
        `/movies?genres[]=${genres[0]}&genres[]=${genres[1]}`
      );
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([data.movies[1], data.movies[0]]);
    });

    test("response with movies by genres and duration", async () => {
      // And the last one. If we provide both duration and genres parameter,
      // then we should get the same result as for genres parameter only, but narrowed by a runtime.
      // So we should return only those movies that contain at least one of the specified genres and have a runtime between <duration - 10> and <duration + 10>.

      const duration = 100;
      const genres = ["A", "B"];
      const data = {
        movies: [
          {
            id: 1,
            genres: ["A"],
            runtime: "90",
          },
          {
            id: 2,
            genres: ["A", "B"],
            runtime: "80",
          },
          {
            id: 3,
            genres: ["C"],
            runtime: "100",
          },
          {
            id: 4,
            genres: ["B"],
            runtime: "110",
          },
        ] as Partial<Movie>[],
      } as Data;
      const dataPath = await saveTestData(data, "genres");
      const app = new App([getController(dataPath)]);
      const res = await request(app.getServer()).get(
        `/movies?genres[]=${genres[0]}&genres[]=${genres[1]}&duration=${duration}`
      );
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([data.movies[0], data.movies[3]]);
    });
  });

  describe("/ POST", () => {
    test("should response with 400 when payload invalid", async () => {
      const payload: Partial<MovieDTO> = {
        title: "",
      };
      const dataPath = path.resolve(__dirname, `movies.post.400.data.json`);
      const app = new App([getController(dataPath)]);
      const res = await request(app.getServer()).post("/movies").send(payload);
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBeDefined();
    });

    test("should response with new movie", async () => {
      const genres = ["a", "b"];
      const data = {
        genres,
        movies: [
          {
            id: 1,
            genres: ["a"],
          },
        ] as Partial<Movie>[],
      } as Data;
      const dataPath = await saveTestData(data, "post.200");
      const app = new App([getController(dataPath)]);

      const payload: MovieDTO = {
        title: "title",
        year: "2022",
        director: "director",
        genres: [genres[0]],
        runtime: "100",
      };
      const res = await request(app.getServer()).post("/movies").send(payload);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(
        expect.objectContaining({
          ...payload,
          id: 2,
        } as Movie)
      );
      const actualData = JSON.parse(await fs.readFile(dataPath, "utf8"));
      expect(actualData).toEqual({
        genres: data.genres,
        movies: [...data.movies, res.body],
      });
    });
  });
});
