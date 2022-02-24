import { Request, Response, NextFunction } from "express";
import HttpException from "../exception/http.exception";

export default function errorMiddleware(
  error: Error,
  _: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof HttpException) {
    response.status(error.statusCode).json({ message: error.message });
  } else {
    response.status(500).json({ message: error.message });
  }
  next();
}
