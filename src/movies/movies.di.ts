import { MoviesRepository } from "./movies.repository";
import { MoviesService } from "./movies.service";
import { dataService } from "../di";

const moviesRepository = new MoviesRepository(dataService);

const moviesService = new MoviesService(moviesRepository);

export { moviesService };
