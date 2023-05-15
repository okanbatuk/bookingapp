"use strict";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { loginSchema, registerSchema } from "../utils/auth.validations.js";
import * as authService from "../services/auth.service.js";
import * as tokenProvider from "../utils/generateTokens.js";
import redisClient from "../../configs/redisconnect.js";
import { REFRESH_TOKEN_SECRET } from "../../configs/vars.js";

/*
 * Create new User
 *
 * @body String username
 * @body String email
 * @body String password
 *
 * POST /api/register
 */
const register = async (req, res, next) => {
  try {
    // Check req.body
    await registerSchema.validateAsync(req.body);

    // if user cant be registered returns an error
    let user = await authService.create(req.body);

    res.onlyMessage(`${user.username} is created successfully..`);
  } catch (error) {
    next(error);
  }
};

/*
 * User Login
 *
 * @body String username  ||  @body String email
 * @body String password
 *
 * POST /api/login
 */
const login = async (req, res, next) => {
  try {
    // Check req.body
    await loginSchema.validateAsync(req.body);

    // Get cookies from request
    let cookies = req.cookies;

    // if submitted user infos is incorrect returns an error
    let user = await authService.login(req.body);

    // Generate a new Access Token
    let newAccessToken = await tokenProvider.generateAccessToken({
      username: user.username,
      role: user.role,
    });

    // Generate a new Refresh Token
    let newRefreshToken = await tokenProvider.generateRefreshToken({
      username: user.username,
      role: user.role,
    });

    // Add new refresh toke nto redis cache mem
    await redisClient
      .multi()
      .sAdd(user._id.toString(), newRefreshToken)
      .expire(user._id.toString(), 24 * 60 * 60)
      .exec();

    /*
     *
     * if cookie doesnt exist, there is no problem.
     *    Give the new refresh token and go.
     *
     * if cookies and cookies token exist, there is an old refresh token
     *    Delete the old token and go
     */
    cookies?.token &&
      (res.clearCookie("token", {
        httpOnly: true,
        // sameSite: "None",
        // secure: true,
      }),
      await redisClient.sRem(user._id.toString(), cookies.token));

    // Add the refresh token to cookie
    res.cookie("token", newRefreshToken, {
      httpOnly: true,
      // sameSite: "None",
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.respond({ user, accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

/*
 * Regenerate the Access Token
 *
 * @public GET /api/refresh/:id
 * */
const regenerateToken = async (req, res, next) => {
  let { id } = req.params;
  let { token } = req.cookies;

  // Check the refresh token in req
  if (!token)
    return next({
      message: "Token wasn't provided!",
      status: httpStatus.FORBIDDEN,
    });

  // delete the to be used
  res.clearCookie("token", {
    httpOnly: true,
    // sameSite: "None",
    // secure: true
  });

  // check the tokens owned by user
  let { members } = await redisClient.sScan(id, 0, { MATCH: token });

  if (members.length > 0) {
    // remove used token
    await redisClient.sRem(id, token);

    // verify the token and regenerate access and refresh tokens
    jwt.verify(token, REFRESH_TOKEN_SECRET, async (err, decoded) => {
      // token is expired
      if (err)
        return next({
          message: "Token is expired",
          status: httpStatus.UNAUTHORIZED,
        });

      // Create new access token cuz refresh token is valid
      let newAccessToken = await tokenProvider.generateAccessToken({
        username: decoded.username,
        role: decoded.role,
      });

      // Create new Refresh Token cuz current token was used
      let newRefreshToken = await tokenProvider.generateRefreshToken({
        username: decoded.username,
        role: decoded.role,
      });

      // Add new Refresh token next to other tokens owned by user
      await redisClient
        .multi()
        .sAdd(id, newRefreshToken)
        .expire(id, 24 * 60 * 60)
        .exec();

      // Set the token in cookie
      res.cookie("token", newRefreshToken, {
        httpOnly: true,
        // sameSite: "None",
        // secure: true
      });
      res.respond({ accessToken: newAccessToken });
    });
  } else {
    // Find the hacked user
    jwt.verify(token, REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err)
        return next({ message: "FORBIDDEN", status: httpStatus.FORBIDDEN });

      // find and delete the hacked user's tokens
      await redisClient.DEL(id);
      next({ message: "FORBIDDEN", status: httpStatus.FORBIDDEN });
    });
  }
};

/*
 *
 * Clear jwt cookie and delete refresh token
 *
 * GET /api/logout
 */
const logout = async (req, res, next) => {
  const cookies = req.cookies;

  // If cookies is exist check token in cookies
  if (!cookies || !cookies.token)
    return res.onlyMessage("No Content", httpStatus.NO_CONTENT);

  const refreshToken = cookies.token;

  // Delete the token
  res.clearCookie("token", {
    httpOnly: true /* sameSite: "None", secure: true  */,
  });

  // Find user according to the Refresh Token
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err)
      return next({ message: "No Content", status: httpStatus.NO_CONTENT });

    // Find user according to decoded token
    const user = await User.findOne({
      username: decoded.username,
    });
    let userId = user._doc._id.toString();

    // Tokens of found user should be deleted
    let count = await redisClient.sCard(userId);

    // If count is more than 1, just delete this refresh token
    count > 1
      ? await redisClient.sRem(userId, refreshToken)
      : await redisClient.del(userId);

    res.onlyMessage("Log out successfully");
  });
};

export { register, login, regenerateToken, logout };
