import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../../configs/vars.js";
import httpStatus from "http-status";

/*
 * Generate a new Access Token
 *
 * @private
 * */
const generateAccessToken = async (info) => {
  return new Promise((resolve, reject) => {
    let newAccessToken = jwt.sign(info, ACCESS_TOKEN_SECRET, {
      expiresIn: "30s",
    });

    newAccessToken
      ? resolve(newAccessToken)
      : reject({
          message: "Something went wrong",
          status: httpStatus.INTERNAL_SERVER_ERROR,
        });
  });
};

/*
 * Generate a new Refresh Token
 *
 * @private
 * */
const generateRefreshToken = async (info) => {
  return new Promise((resolve, reject) => {
    let newRefreshToken = jwt.sign(info, REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    newRefreshToken
      ? resolve(newRefreshToken)
      : reject({
          message: "Something went wrong!",
          status: httpStatus.INTERNAL_SERVER_ERROR,
        });
  });
};

export { generateAccessToken, generateRefreshToken };
