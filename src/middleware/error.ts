import { NextFunction, Request, Response } from "express";

import { StatusCodes } from "http-status-codes";

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const msg = err.message || "something went wrong, try again later";
  res.status(statusCode).json({ msg });
};
