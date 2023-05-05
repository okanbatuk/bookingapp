import httpStatus from "http-status";

const resHelper = (req, res, next = null) => {
  res.respond = (data = null, status = httpStatus.OK, message = "") => {
    res.statusCode = status;
    res.json(
      data === null
        ? { success: true, message: message }
        : { success: true, data: data }
    );
  };

  res.onlyMessage = (message, status = httpStatus.OK) => {
    res.respond(null, status, message);
  };

  if (next !== null) next();
};

export default resHelper;
