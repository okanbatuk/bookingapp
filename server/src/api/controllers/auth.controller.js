"use strict";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import * as authService from "../services/auth.service.js";
import * as tokenProvider from "../utils/generateTokens.js";
import redisClient from "../../configs/redisconnect.js";
import { REFRESH_TOKEN_SECRET } from "../../configs/vars.js";

// Create a new user
const register = async (req, res, next) => {
  try {
    // if user cant be registered returns an error
    let user = await authService.create(req.body);
    res.onlyMessage(`${user.username} is created successfully..`);
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    // Get cookies from request
    let cookies = req.cookies;

    // if submitted user infos is incorrect returns an error
    let user = await authService.login(req.body);
    let userId = user._doc._id.toString();

    // Generate a new Access Token
    let newAccessToken = await tokenProvider.generateAccessToken({
      username: user._doc.username,
    });

    // Generate a new Refresh Token
    let newRefreshToken = await tokenProvider.generateRefreshToken({
      username: user._doc.username,
    });

    // Add new refresh toke nto redis cache mem
    await redisClient
      .multi()
      .sAdd(userId, newRefreshToken)
      .expire(userId, 24 * 60 * 60)
      .exec();

    /*
     *
     * if cookie doesnt exist, there is no problem.
     *    Give the new refresh token and go.
     *
     * if cookies and cookies jwt exist, there is an old refresh token
     *    Delete the old token and go
     */
    cookies?.jwt &&
      (res.clearCookie("jwt", {
        httpOnly: true,
        // sameSite: "None",
        // secure: true,
      }),
      await redisClient.sRem(userId, cookies.jwt));

    // Add the refresh token to cookie
    res.cookie("jwt", newRefreshToken, {
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
 *
 * Clear jwt cookie and delete refresh token
 *
 * GET /api/logout
 */
const logout = async (req, res, next) => {
  const cookies = req.cookies;

  // If cookies is exist check jwt in cookies
  if (!cookies || !cookies.jwt)
    return res.onlyMessage("No Content", httpStatus.NO_CONTENT);

  const refreshToken = cookies.jwt;

  // Delete the token
  res.clearCookie("jwt", {
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

export { register, login, logout };
