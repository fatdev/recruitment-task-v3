import * as dotenv from "dotenv";
import App from "./app";
import { MoviesController } from "./movies/movies.controller";
import { moviesService } from "./movies/movies.di";

dotenv.config();

new App([new MoviesController(moviesService)]).listen();
