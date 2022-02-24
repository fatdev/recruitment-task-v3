import { promises as fs } from "fs";
import { Data } from "./data.interface";

export type DataConfig = {
  path: string;
};

export class DataService {
  config: DataConfig;

  constructor(config: DataConfig) {
    this.config = config;
  }

  async readData(): Promise<Data> {
    const db = await fs.readFile(this.config.path, "utf8");
    return JSON.parse(db);
  }

  async saveData(data: Data): Promise<void> {
    const dataJSON = JSON.stringify(data, null, 2);
    await fs.writeFile(this.config.path, dataJSON);
  }
}
