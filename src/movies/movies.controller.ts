import { NextFunction, Request, Response, Router } from "express";
import Controller from "../interfaces/controller.interface";
import validationMiddleware from "../middleware/validation.middleware";
import { MovieDTO } from "./movie.dto";
import { MoviesService } from "./movies.service";

export class MoviesController implements Controller {
  moviesService: MoviesService;

  public path = "/movies";
  public router = Router();

  constructor(moviesService: MoviesService) {
    this.moviesService = moviesService;
    this.initializeRoutes();
  }

  async get(req: Request, res: Response, next: NextFunction) {
    return this.moviesService
      .fetch(req.query)
      .then((movies) => res.status(200).json(movies))
      .catch(next);
  }

  async post(req: Request, res: Response, next: NextFunction) {
    return this.moviesService
      .save(req.body)
      .then((movie) => res.status(201).json(movie))
      .catch((err) => next(err));
  }

  private initializeRoutes() {
    this.router.get(this.path, this.get.bind(this));
    this.router.post(
      this.path,
      validationMiddleware(MovieDTO),
      this.post.bind(this)
    );
  }
}
