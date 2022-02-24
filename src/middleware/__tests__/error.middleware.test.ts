import { NextFunction, Request, Response } from "express";
import HttpException from "../../exception/http.exception";
import errorMiddleware from "../error.middleware";

describe("errorMiddleware", () => {
  let mockRequest: Partial<Request>;
  const next: NextFunction = jest.fn();

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test("should response with error when HttpException", () => {
    const res = mockResponse();
    const exception = new HttpException(400, "error");
    errorMiddleware(exception, mockRequest as Request, res as Response, next);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({ message: exception.message });
    expect(next).toBeCalledTimes(1);
  });
  test("should response with 500 when Error", () => {
    const res = mockResponse();
    const error = new Error("test");
    errorMiddleware(error, mockRequest as Request, res as Response, next);
    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith({ message: error.message });
    expect(next).toBeCalledTimes(1);
  });
});
