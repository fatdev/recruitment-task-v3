import exp from "constants";
import { NextFunction, Request, Response } from "express";
import { Movie } from "../movie.interface";
import { MoviesController } from "../movies.controller";
import { MoviesService } from "../movies.service";

describe("Movies controller", () => {
  const next: NextFunction = jest.fn();
  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  describe("get", () => {
    const req: Partial<Request> = {
      query: {
        duration: "100",
        genres: ["Comedy"],
      },
    };
    test("should call fetch", async () => {
      const expected: Partial<Movie>[] = [{ id: 1 }, { id: 2 }];
      const res = mockResponse();
      const moviesService = {
        fetch: jest.fn().mockResolvedValue(expected),
      } as unknown as MoviesService;
      const moviesController = new MoviesController(moviesService);

      await moviesController.get(req as Request, res as Response, next);
      expect(moviesService.fetch).toHaveBeenCalledWith(req.query);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toBeCalledWith(expected);
    });
    test("should call next when error", async () => {
      const error = new Error("test");
      const res = mockResponse();
      const moviesService = {
        fetch: jest.fn().mockRejectedValue(error),
      } as unknown as MoviesService;
      const moviesController = new MoviesController(moviesService);

      await moviesController.get(req as Request, res as Response, next);
      expect(moviesService.fetch).toHaveBeenCalledWith(req.query);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("post", () => {
    const req: Partial<Request> = {
      body: {
        title: "title",
      },
    };
    test("should call save", async () => {
      const expected: Partial<Movie> = { id: 2 };
      const res = mockResponse();
      const moviesService = {
        save: jest.fn().mockResolvedValue(expected),
      } as unknown as MoviesService;
      const moviesController = new MoviesController(moviesService);

      await moviesController.post(req as Request, res as Response, next);
      expect(moviesService.save).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toBeCalledWith(expected);
    });
    test("should call next when error", async () => {
      const error = new Error("test");
      const res = mockResponse();
      const moviesService = {
        save: jest.fn().mockRejectedValue(error),
      } as unknown as MoviesService;
      const moviesController = new MoviesController(moviesService);

      await moviesController.post(req as Request, res as Response, next);
      expect(moviesService.save).toHaveBeenCalledWith(req.body);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
