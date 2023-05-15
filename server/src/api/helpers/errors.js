import httpStatus from "http-status";
import APIError from "../helpers/APIError.js";

const handler = (err, req, res, next) => {
  const response = {
    success: false,
    status: err.status || httpStatus.INTERNAL_SERVER_ERROR,
    message: err.message,
  };
  res.status(response.status).json(response);
};

// If the error is difference from APIError
const converter = (err, req, res, next) => {
  let convertedError = err;
  if (err.name == "ValidationError") {
    convertedError = new APIError({
      message: "ValidationError",
      status: err.statusCode || httpStatus.BAD_REQUEST,
    });
  } else if (!(err instanceof Error)) {
    convertedError = new APIError({
      message: err.message,
      status: err.status || httpStatus.BAD_REQUEST,
    });
  }
  return handler(convertedError, req, res, next);
};

const notFound = (req, res, next) => {
  const error = new APIError({
    message: "NOT FOUND",
    status: httpStatus.NOT_FOUND,
  });
  return handler(error, req, res, next);
};

export { notFound, converter };
