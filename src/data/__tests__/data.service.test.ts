import { DataService } from "../data.service";
import { promises as fs } from "fs";
import path from "path";
import { Data } from "../data.interface";
import { Movie } from "../../movies/movie.interface";

describe("Data service", () => {
  describe("readData", () => {
    const expected = {
      genres: ["a", "b"],
      movies: [{ id: 1 }, { id: 2 }],
    };
    test("should return data object from json", async () => {
      const dataService = new DataService({
        path: path.resolve(__dirname, "db.test.json"),
      });
      const actual = await dataService.readData();
      expect(actual).toEqual(expected);
    });
  });
  describe("saveData", () => {
    const given = {
      genres: ["a"],
      movies: [{ id: 1 }] as Movie[],
    } as Data;
    test("should write object to json file", async () => {
      const actualFilePath = path.resolve(__dirname, "actual.db.test.json");
      const dataService = new DataService({
        path: actualFilePath,
      });
      await dataService.saveData(given);
      const actualJSON = await fs.readFile(actualFilePath, "utf8");
      const actual = JSON.parse(actualJSON);
      expect(actual).toEqual(given);
      await fs.unlink(actualFilePath);
    });
  });
});
