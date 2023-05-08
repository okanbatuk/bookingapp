"use strict";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { ACCESS_TOKEN_SECRET } from "../../configs/vars.js";

/*
 * This middleware is used to check jwt when user is logged in
 *
 * @private
 */
const verifyJwt = (req, res, next) => {
  // Get auth value in req headers
  const token = req.headers.authorization?.split(" ")[1];

  // Verify the token
  token
    ? jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err)
          return next({
            message: err.message,
            status: httpStatus.UNAUTHORIZED,
          });
        req.user = decoded;
        next();
      })
    : next({
        message: "Token was not provided!!",
        status: httpStatus.FORBIDDEN,
      });
};

export default verifyJwt;
