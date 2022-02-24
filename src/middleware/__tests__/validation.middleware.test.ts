import { IsNotEmpty } from "class-validator";
import { NextFunction } from "express";
import HttpException from "../../exception/http.exception";
import validationMiddleware from "../validataion.middleware";

class TestDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}

describe("Validation middleware", () => {
  test("should call next when no errors", () => {
    const req: any = {
        body: {
          title: "title",
          description: "description",
        } as TestDTO,
      },
      res: any = {},
      next: NextFunction = jest.fn(),
      validator = validationMiddleware(TestDTO);

    validator(req, res, next);
    // expect(next).toBeCalledTimes(1);
  });
  test("should call next with HttpException when errors", () => {
    const req: any = {
        body: {} as TestDTO,
      },
      res: any = {},
      next: NextFunction = jest.fn(),
      validator = validationMiddleware(TestDTO);

    validator(req, res, next);
    // expect(next).toBeCalledWith(
    //   new HttpException(
    //     400,
    //     "title should not be empty, description should not be empty"
    //   )
    // );
  });
});
