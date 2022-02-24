import { RequestHandler } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import HttpException from "../exception/http.exception";

export default function validationMiddleware(type: any): RequestHandler {
  return (req, _, next) => {
    const dtoObj = plainToInstance(type, req.body);
    validate(dtoObj).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors
          .map((error) => (Object as any).values(error.constraints))
          .join(", ");
        next(new HttpException(400, message));
      } else {
        next();
      }
    });
  };
}
