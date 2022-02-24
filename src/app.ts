import express from "express";
import cors from "cors";
import errorMiddleware from "./middleware/error.middleware";
import Controller from "./interfaces/controller.interface";

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.initializeMiddleware();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public getServer() {
    return this.app;
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  private initializeMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }
}

export default App;
