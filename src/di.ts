import path from "path";
import { DataService } from "./data/data.service";

const dataService = new DataService({
  path: path.resolve(__dirname, "data/db.json"),
});

export { dataService };
